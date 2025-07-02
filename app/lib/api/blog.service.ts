/**
 * Blog API Service Layer - New Implementation
 * Extends BaseApiService for unified error handling and logging
 * Provides clean API contract for backend implementation with dummy data fallback
 */

import { BaseApiService, ApiError, ErrorCode, PaginatedResponse } from '@/lib/api/base';
import { BlogPost, BlogPostNoAuthor, Category, Tag } from '@/app/types/blog';
import { 
  blogPostsNoAuthor, 
  categoryGroups,
  getPostById as getPostByIdDummy,
  getPostNoAuthorById as getPostNoAuthorByIdDummy
} from '@/app/data/blogData';

// Blog-specific API parameters
interface BlogPostParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  tagId?: number;
  search?: string;
  sortBy?: 'date' | 'views' | 'likes';
  order?: 'asc' | 'desc';
}

interface SearchOptions {
  searchIn?: ('title' | 'content' | 'tags')[];
  limit?: number;
}

/**
 * Blog API Service Class
 * Defines the contract that backend should implement
 */
class BlogApiService extends BaseApiService {
  protected getServiceName(): string {
    return 'BlogApiService';
  }

  /**
   * API Endpoints Definition - Contract for Backend Implementation
   */
  private readonly endpoints = {
    posts: '/api/blog/posts',
    post: (id: number) => `/api/blog/posts/${id}`,
    categories: '/api/blog/categories',
    tags: '/api/blog/tags',
    popularPosts: '/api/blog/posts/popular',
    relatedPosts: (id: number) => `/api/blog/posts/${id}/related`,
    searchPosts: '/api/blog/posts/search'
  } as const;

  /**
   * Get all blog posts with pagination and filters
   */
  async getPosts(params?: BlogPostParams): Promise<PaginatedResponse<BlogPostNoAuthor>> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
        if (params?.categoryId) queryParams.set('categoryId', params.categoryId.toString());
        if (params?.tagId) queryParams.set('tagId', params.tagId.toString());
        if (params?.search) queryParams.set('search', params.search);
        if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
        if (params?.order) queryParams.set('order', params.order);

        // For now, throw to trigger fallback
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // const endpoint = `${this.endpoints.posts}?${queryParams.toString()}`;
        // return await this.fetchApi<PaginatedResponse<BlogPostNoAuthor>>(endpoint);
      },
      () => this.getDummyPosts(params),
      'getPosts'
    );
  }

  /**
   * Get single blog post by ID
   */
  async getPost(id: number, includeAuthor = false): Promise<BlogPost | BlogPostNoAuthor> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        // For now, throw to trigger fallback
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // const endpoint = includeAuthor 
        //   ? `${this.endpoints.post(id)}?include=author` 
        //   : this.endpoints.post(id);
        // return await this.fetchApi<BlogPost | BlogPostNoAuthor>(endpoint);
      },
      () => {
        const post = includeAuthor 
          ? getPostByIdDummy(id) 
          : getPostNoAuthorByIdDummy(id);
          
        if (!post) {
          throw new ApiError('Post not found', ErrorCode.NOT_FOUND, 404);
        }
        
        return post;
      },
      `getPost(${id})`
    );
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // return await this.fetchApi<Category[]>(this.endpoints.categories);
      },
      () => categoryGroups.flatMap(group => group.categories),
      'getCategories'
    );
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // return await this.fetchApi<Tag[]>(this.endpoints.tags);
      },
      () => {
        const tagMap = new Map<number, Tag>();
        blogPostsNoAuthor.forEach(post => {
          post.tags.forEach(tag => {
            tagMap.set(tag.id, tag);
          });
        });
        return Array.from(tagMap.values());
      },
      'getTags'
    );
  }

  /**
   * Get related posts
   */
  async getRelatedPosts(postId: number, limit = 5): Promise<BlogPostNoAuthor[]> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // const endpoint = `${this.endpoints.relatedPosts(postId)}?limit=${limit}`;
        // return await this.fetchApi<BlogPostNoAuthor[]>(endpoint);
      },
      () => {
        const currentPost = getPostNoAuthorByIdDummy(postId);
        if (!currentPost) return [];
        
        return blogPostsNoAuthor
          .filter(p => 
            p.id !== postId && 
            p.categoryId === currentPost.categoryId
          )
          .slice(0, limit);
      },
      `getRelatedPosts(${postId})`
    );
  }

  /**
   * Get popular posts
   */
  async getPopularPosts(limit = 10): Promise<BlogPostNoAuthor[]> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // const endpoint = `${this.endpoints.popularPosts}?limit=${limit}`;
        // return await this.fetchApi<BlogPostNoAuthor[]>(endpoint);
      },
      () => {
        return blogPostsNoAuthor
          .sort((a, b) => 
            new Date(b.publishedAt).getTime() - 
            new Date(a.publishedAt).getTime()
          )
          .slice(0, limit);
      },
      'getPopularPosts'
    );
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, options?: SearchOptions): Promise<BlogPostNoAuthor[]> {
    return this.safeExecute(
      async () => {
        // TODO: Real API call when backend is ready
        const queryParams = new URLSearchParams();
        queryParams.set('q', query);
        if (options?.searchIn) queryParams.set('searchIn', options.searchIn.join(','));
        if (options?.limit) queryParams.set('limit', options.limit.toString());
        
        throw new Error('API not implemented - using dummy data fallback');
        
        // Future real API call:
        // const endpoint = `${this.endpoints.searchPosts}?${queryParams.toString()}`;
        // return await this.fetchApi<BlogPostNoAuthor[]>(endpoint);
      },
      () => {
        const term = query.toLowerCase();
        const searchIn = options?.searchIn || ['title', 'content'];
        
        return blogPostsNoAuthor.filter(post => {
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
      },
      `searchPosts("${query}")`
    );
  }

  /**
   * Internal method to process dummy data with pagination
   */
  private getDummyPosts(params?: BlogPostParams): PaginatedResponse<BlogPostNoAuthor> {
    try {
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
      this.logError('getDummyPosts', error);
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      };
    }
  }
}

// Create singleton instance
export const blogApiService = new BlogApiService();

// Export individual functions for backward compatibility
export const {
  getPosts,
  getPost,
  getCategories,
  getTags,
  getRelatedPosts,
  getPopularPosts,
  searchPosts
} = blogApiService; 