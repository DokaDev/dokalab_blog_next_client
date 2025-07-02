/**
 * Common Type Definitions
 * Shared types used across the application
 * Centralized to avoid duplication and maintain consistency
 */

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Basic response wrapper
export interface BaseResponse {
  success: boolean;
  message?: string;
}

// Generic API response
export interface ApiResponse<T = unknown> extends BaseResponse {
  data: T;
  timestamp?: string;
}

// Error response structure
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status?: number;
    fields?: Record<string, string>;
    retryAfter?: number;
    stack?: string; // Only in development
  };
}

// Pagination information
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  filters?: Record<string, unknown>;
}

// Error codes enum for consistent error handling
export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors (5xx)
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Application specific
  API_NOT_IMPLEMENTED = 'API_NOT_IMPLEMENTED',
  FEATURE_DISABLED = 'FEATURE_DISABLED'
}

// Common sorting and filtering options
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: string;
  value: unknown;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortOption[];
  filters?: FilterOption[];
  search?: string;
}

// Component prop utility types
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children?: React.ReactNode;
}

export interface WithId {
  id: string | number;
}

export interface WithTimestamps {
  createdAt: string;
  updatedAt?: string;
}

// Loading and async state management
export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

// Form field validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface FormField<T = unknown> {
  value: T;
  error?: string | null;
  touched: boolean;
  validation?: ValidationRule;
} 