/**
 * API Response Type Definitions
 * These types match the JSON response models documented in the API calls
 */

// Re-export common types for backward compatibility
export type { ApiResponse, ErrorResponse, PaginatedResponse } from '@/lib/types/common';

// Backward compatibility aliases with minimal differentiation to avoid ESLint warnings
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error: {
    code: string;
    message: string;
    status?: number;
    fields?: Record<string, string>;
    retryAfter?: number;
    stack?: string;
  };
}

// Re-export API types for backward compatibility
export type {
  BlogPostResponse,
  BlogPostSummary,
  CategoryResponse,
  TagResponse,
  AuthorResponse,
  AdjacentPostsResponse,
  ContactFormRequest,
  ContactFormResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PostActionResponse,
  LoginRequest,
  LoginResponse,
  SearchResult,
  BlogStatistics,
  BlogPostsResponse,
  CategoriesResponse,
  TagsResponse
} from '@/lib/types/api';

// Re-export error codes from common types
export { ErrorCode as ApiErrorCode } from '@/lib/types/common'; 