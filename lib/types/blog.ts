/**
 * Blog Service Type Definitions
 * Request parameters, options, and service-specific types for blog functionality
 */

import { QueryOptions } from './common';

// Blog post query parameters
export interface BlogPostParams extends QueryOptions {
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  status?: 'draft' | 'published' | 'all';
  sortBy?: 'date' | 'views' | 'likes' | 'title';
  order?: 'asc' | 'desc';
  includeDrafts?: boolean;
}

// Search options for blog posts
export interface BlogSearchOptions {
  searchIn?: ('title' | 'content' | 'excerpt' | 'tags' | 'category')[];
  limit?: number;
  categoryId?: number;
  tagIds?: number[];
  minReadingTime?: number;
  maxReadingTime?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Category query parameters
export interface CategoryParams {
  includePostCount?: boolean;
  includeChildren?: boolean;
  parentId?: number | 'root';
}

// Tag query parameters  
export interface TagParams {
  includePostCount?: boolean;
  popularOnly?: boolean;
  limit?: number;
}

// Related posts options
export interface RelatedPostsOptions {
  limit?: number;
  similarity?: 'category' | 'tags' | 'content';
  excludeIds?: number[];
}

// Popular posts options
export interface PopularPostsOptions {
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  categoryId?: number;
}

// Content filtering options
export interface ContentFilterOptions {
  includeHtml?: boolean;
  includeMarkdown?: boolean;
  maxLength?: number;
  stripTags?: boolean;
}

// Blog navigation options
export interface BlogNavigationOptions {
  includeCategories?: boolean;
  includeTags?: boolean;
  includeArchive?: boolean;
  maxItems?: number;
}

// Archive options
export interface ArchiveParams {
  year?: number;
  month?: number;
  groupBy?: 'year' | 'month' | 'day';
}

// SEO and metadata options
export interface SeoOptions {
  includeMetaTags?: boolean;
  includeOpenGraph?: boolean;
  includeTwitterCard?: boolean;
  includeStructuredData?: boolean;
}

// Export configuration
export interface BlogExportOptions {
  format?: 'json' | 'xml' | 'markdown';
  includeContent?: boolean;
  includeMetadata?: boolean;
  categoryIds?: number[];
  dateFrom?: string;
  dateTo?: string;
} 