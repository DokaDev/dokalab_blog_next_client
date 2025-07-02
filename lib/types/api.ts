/**
 * API Type Definitions
 * Backend API response models and service contracts
 * These types match the JSON response models documented in the API calls
 */

import { WithTimestamps, PaginatedResponse } from './common';

// Blog Post API Types
export interface BlogPostResponse extends WithTimestamps {
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

// Category API Types
export interface CategoryResponse extends WithTimestamps {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  parentId?: number | null;
  children?: CategoryResponse[];
}

// Tag API Types
export interface TagResponse extends WithTimestamps {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

// Author API Types
export interface AuthorResponse extends WithTimestamps {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

// Adjacent Posts Response
export interface AdjacentPostsResponse {
  previous?: BlogPostSummary | null;
  next?: BlogPostSummary | null;
}

// Contact Form API Types
export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

export interface ContactFormResponse extends WithTimestamps {
  id: string;
}

// Admin Post Management Types
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

export interface PostActionResponse extends WithTimestamps {
  id: number;
  slug: string;
  publishedAt?: string | null;
  status?: 'draft' | 'published';
}

// Authentication API Types
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

// Search and Statistics Types
export interface SearchResult {
  posts: BlogPostSummary[];
  totalCount: number;
  searchTerm: string;
  searchTime: number;
}

export interface BlogStatistics {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
  popularPosts: BlogPostSummary[];
  recentPosts: BlogPostSummary[];
}

// Type aliases for API responses
export type BlogPostsResponse = PaginatedResponse<BlogPostResponse>;
export type CategoriesResponse = CategoryResponse[];
export type TagsResponse = TagResponse[]; 