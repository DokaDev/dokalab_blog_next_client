/**
 * API Response Type Definitions
 * These types match the JSON response models documented in the API calls
 */

// Common Response Types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status?: number;
    fields?: Record<string, string>;
    retryAfter?: number;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination Types
export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  filters?: Record<string, unknown>;
}

// Blog Post Types
export interface BlogPostResponse {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  category?: CategoryResponse;
  tags: TagResponse[];
  author?: AuthorResponse;
  publishedAt: string;
  updatedAt?: string;
  createdAt?: string;
  readingTime: number;
  views?: number;
  likes?: number;
  slug: string;
  status?: 'draft' | 'published';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  relatedPosts?: BlogPostSummary[];
}

export interface BlogPostSummary {
  id: number;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  slug: string;
}

// Category Types
export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  parentId?: number | null;
  children?: CategoryResponse[];
}

// Tag Types
export interface TagResponse {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

// Author Types
export interface AuthorResponse {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Adjacent Posts Response
export interface AdjacentPostsResponse {
  previous?: BlogPostSummary | null;
  next?: BlogPostSummary | null;
}

// Contact Form Types
export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

export interface ContactFormResponse {
  id: string;
  timestamp: string;
}

// Admin Post Types
export interface CreatePostRequest {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  tags: string[];
  status: 'draft' | 'published';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

export interface UpdatePostRequest extends CreatePostRequest {
  id?: number;
}

export interface PostActionResponse {
  id: number;
  slug: string;
  publishedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
  status?: 'draft' | 'published';
}

// Auth Types (for admin)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  expiresAt: string;
}

// Error Codes
export enum ApiErrorCode {
  // General
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  
  // Rate Limiting
  RATE_LIMIT = 'RATE_LIMIT',
  
  // Server
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
} 