/**
 * Base API Service with unified error handling and logging
 * Provides common functionality for all API services
 */

import { config } from '@/config/env';

// Common API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error codes enum for consistent error handling
export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  API_NOT_IMPLEMENTED = 'API_NOT_IMPLEMENTED'
}

// Response wrapper types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Base API service configuration
interface ApiServiceConfig {
  baseUrl?: string;
  timeout?: number;
  enableLogging?: boolean;
  enableFallback?: boolean;
  simulateDelay?: number;
}

/**
 * Base API Service Class
 * Provides common functionality for all API services
 */
export abstract class BaseApiService {
  protected config: Required<ApiServiceConfig>;

  constructor(serviceConfig: ApiServiceConfig = {}) {
    this.config = {
      baseUrl: serviceConfig.baseUrl || config.apiUrl,
      timeout: serviceConfig.timeout || 10000,
      enableLogging: serviceConfig.enableLogging ?? config.features.debug,
      enableFallback: serviceConfig.enableFallback ?? true,
      simulateDelay: serviceConfig.simulateDelay ?? (config.isDevelopment ? 100 : 0)
    };
  }

  /**
   * Enhanced fetch wrapper with comprehensive error handling
   */
  protected async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      this.log('API Request:', { method: options.method || 'GET', url });

      // Simulate API delay in development
      if (this.config.simulateDelay > 0) {
        await this.delay(this.config.simulateDelay);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this.safeJsonParse(response);
        const errorMessage = typeof errorData?.message === 'string' 
          ? errorData.message 
          : `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(
          errorMessage,
          this.mapHttpStatusToErrorCode(response.status),
          response.status
        );
      }

      const data = await response.json();
      this.log('API Response:', { status: response.status, hasData: !!data });
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle specific error types
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          'Request timeout',
          ErrorCode.TIMEOUT_ERROR,
          408,
          error
        );
      }

      // Network errors
      throw new ApiError(
        'Network error or server unavailable',
        ErrorCode.NETWORK_ERROR,
        0,
        error
      );
    }
  }

  /**
   * Safe execution wrapper with fallback support
   */
  protected async safeExecute<T>(
    operation: () => Promise<T>,
    fallback?: () => T | Promise<T>,
    context = 'API operation'
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logError(context, error);

      // If API is not implemented and fallback is available
      if (error instanceof Error && 
          error.message.includes('API not implemented') && 
          fallback && 
          this.config.enableFallback) {
        this.log(`Using fallback for ${context}`);
        return await fallback();
      }

      // Re-throw known API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Use fallback for unknown errors if available
      if (fallback && this.config.enableFallback) {
        this.log(`Fallback triggered for ${context} due to unexpected error`);
        return await fallback();
      }

      // Transform unknown errors to API errors
      throw new ApiError(
        `${context} failed`,
        ErrorCode.UNKNOWN_ERROR,
        500,
        error
      );
    }
  }

  /**
   * Batch processing with individual error handling
   */
  protected async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: {
      concurrency?: number;
      continueOnError?: boolean;
    } = {}
  ): Promise<Array<R | null>> {
    const { concurrency = 5, continueOnError = true } = options;
    const results: Array<R | null> = [];
    
    for (let i = 0; i < items.length; i += concurrency) {
      const batch = items.slice(i, i + concurrency);
      const batchPromises = batch.map(async (item) => {
        try {
          return await processor(item);
        } catch (error) {
          this.logError(`Batch processing item ${i}`, error);
          return continueOnError ? null : Promise.reject(error);
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Utility methods
   */
  private async safeJsonParse(response: Response): Promise<Record<string, unknown> | null> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400: return ErrorCode.VALIDATION_ERROR;
      case 401: return ErrorCode.UNAUTHORIZED;
      case 403: return ErrorCode.FORBIDDEN;
      case 404: return ErrorCode.NOT_FOUND;
      case 408: return ErrorCode.TIMEOUT_ERROR;
      case 500:
      case 502:
      case 503:
      case 504: return ErrorCode.SERVER_ERROR;
      default: return ErrorCode.UNKNOWN_ERROR;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      if (data !== undefined) {
        console.log(`[${this.constructor.name}] ${message}`, data);
      } else {
        console.log(`[${this.constructor.name}] ${message}`);
      }
    }
  }

  protected logError(context: string, error: unknown): void {
    if (this.config.enableLogging) {
      console.error(`[${this.constructor.name}] Error in ${context}:`, error);
    }
  }

  // Abstract method for service-specific initialization
  protected abstract getServiceName(): string;
} 