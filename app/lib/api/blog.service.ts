/**
 * Blog API Service Layer
 * Currently returns dummy data, but structured to easily switch to real API calls
 */

import { config } from '@/config/env';
import { BlogPost, BlogPostNoAuthor, Category, Tag } from '@/app/types/blog';
import { 
  blogPosts, 
  blogPostsNoAuthor, 
  categoryGroups,
  getPostById as getPostByIdDummy,
  getPostNoAuthorById as getPostNoAuthorByIdDummy
} from '@/app/data/blogData';

// API response types
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Error handling
class BlogApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'BlogApiError';
  }
}

/**
 * Fetch wrapper with error handling
 * TODO: Add retry logic, request cancellation, and caching
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // TODO: When backend is ready, uncomment this block
  /*
  try {
    const url = `${config.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new BlogApiError(
        error.message || 'API request failed',
        error.code || 'UNKNOWN_ERROR',
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof BlogApiError) {
      throw error;
    }
    throw new BlogApiError(
      'Network error or server unavailable',
      'NETWORK_ERROR',
      500
    );
  }
  */

  // Simulate API delay for development
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return dummy data for now
  throw new Error('API not implemented - using dummy data fallback');
}

/**
 * Blog API Service
 */
export const blogService = {
  /**
   * Get all blog posts with pagination and filters
   */
  async getPosts(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: number;
    tagId?: number;
    search?: string;
    sortBy?: 'date' | 'views' | 'likes';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<BlogPostNoAuthor>> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<PaginatedResponse<BlogPostNoAuthor>>(
        `/posts?${new URLSearchParams(params as any).toString()}`
      );
      */
      
      // Dummy data implementation
      let posts = [...blogPostsNoAuthor];
      
      // Apply filters
      if (params?.categoryId) {
        posts = posts.filter(p => p.categoryId === params.categoryId);
      }
      if (params?.tagId) {
        posts = posts.filter(p => p.tags.some(t => t.id === params.tagId));
      }
      if (params?.search) {
        const term = params.search.toLowerCase();
        posts = posts.filter(p => 
          p.title.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term)
        );
      }
      
      // Sort
      posts.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return params?.order === 'asc' ? dateA - dateB : dateB - dateA;
      });
      
      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const paginatedPosts = posts.slice(start, start + pageSize);
      
      return {
        data: paginatedPosts,
        total: posts.length,
        page,
        pageSize,
        totalPages: Math.ceil(posts.length / pageSize)
      };
    } catch (error) {
      // Fallback to dummy data on error
      return this.getPosts(params);
    }
  },

  /**
   * Get single blog post by ID
   */
  async getPost(id: number, includeAuthor = false): Promise<BlogPost | BlogPostNoAuthor> {
    try {
      // TODO: Real API call
      /*
      const endpoint = includeAuthor ? `/posts/${id}?include=author` : `/posts/${id}`;
      return await fetchApi<BlogPost | BlogPostNoAuthor>(endpoint);
      */
      
      // Dummy data implementation
      const post = includeAuthor 
        ? getPostByIdDummy(id) 
        : getPostNoAuthorByIdDummy(id);
        
      if (!post) {
        throw new BlogApiError('Post not found', 'NOT_FOUND', 404);
      }
      
      return post;
    } catch (error) {
      if (error instanceof BlogApiError && error.status === 404) {
        throw error;
      }
      // Fallback to dummy data on other errors
      const post = includeAuthor 
        ? getPostByIdDummy(id) 
        : getPostNoAuthorByIdDummy(id);
        
      if (!post) {
        throw new BlogApiError('Post not found', 'NOT_FOUND', 404);
      }
      
      return post;
    }
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<Category[]>('/categories');
      */
      
      // Dummy data implementation
      return categoryGroups.flatMap(group => group.categories);
    } catch (error) {
      // Fallback to dummy data
      return categoryGroups.flatMap(group => group.categories);
    }
  },

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<Tag[]>('/tags');
      */
      
      // Dummy data implementation
      const tagMap = new Map<number, Tag>();
      blogPostsNoAuthor.forEach(post => {
        post.tags.forEach(tag => {
          tagMap.set(tag.id, tag);
        });
      });
      return Array.from(tagMap.values());
    } catch (error) {
      // Fallback to dummy data
      const tagMap = new Map<number, Tag>();
      blogPostsNoAuthor.forEach(post => {
        post.tags.forEach(tag => {
          tagMap.set(tag.id, tag);
        });
      });
      return Array.from(tagMap.values());
    }
  },

  /**
   * Get related posts
   */
  async getRelatedPosts(
    postId: number, 
    limit = 5
  ): Promise<BlogPostNoAuthor[]> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<BlogPostNoAuthor[]>(
        `/posts/${postId}/related?limit=${limit}`
      );
      */
      
      // Dummy implementation: Get posts from same category
      const currentPost = getPostNoAuthorByIdDummy(postId);
      if (!currentPost) return [];
      
      return blogPostsNoAuthor
        .filter(p => 
          p.id !== postId && 
          p.categoryId === currentPost.categoryId
        )
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  },

  /**
   * Get popular posts
   */
  async getPopularPosts(limit = 10): Promise<BlogPostNoAuthor[]> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<BlogPostNoAuthor[]>(
        `/posts/popular?limit=${limit}`
      );
      */
      
      // Dummy implementation: Return recent posts
      return blogPostsNoAuthor
        .sort((a, b) => 
          new Date(b.publishedAt).getTime() - 
          new Date(a.publishedAt).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  },

  /**
   * Search posts
   */
  async searchPosts(
    query: string,
    options?: {
      searchIn?: ('title' | 'content' | 'tags')[];
      limit?: number;
    }
  ): Promise<BlogPostNoAuthor[]> {
    try {
      // TODO: Real API call
      /*
      return await fetchApi<BlogPostNoAuthor[]>(
        `/posts/search?q=${encodeURIComponent(query)}&${new URLSearchParams(options as any)}`
      );
      */
      
      // Dummy implementation
      const term = query.toLowerCase();
      return blogPostsNoAuthor.filter(post => {
        const searchIn = options?.searchIn || ['title', 'content'];
        
        if (searchIn.includes('title') && post.title.toLowerCase().includes(term)) {
          return true;
        }
        if (searchIn.includes('content') && 
            (post.excerpt.toLowerCase().includes(term) || 
             post.content.toLowerCase().includes(term))) {
          return true;
        }
        if (searchIn.includes('tags') && 
            post.tags.some(tag => tag.name.toLowerCase().includes(term))) {
          return true;
        }
        return false;
      }).slice(0, options?.limit || 20);
    } catch (error) {
      return [];
    }
  }
};

// Export individual functions for backward compatibility
export const {
  getPosts,
  getPost,
  getCategories,
  getTags,
  getRelatedPosts,
  getPopularPosts,
  searchPosts
} = blogService; 