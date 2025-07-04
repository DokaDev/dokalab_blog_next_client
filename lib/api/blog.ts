/**
 * Enhanced Blog API Service with Caching and Advanced Error Handling
 * Provides optimised blog data access with intelligent caching strategies
 */

import { BaseApiService, ApiError, ErrorCode, PaginatedResponse } from '@/lib/api/base';
import { BlogPostParams, BlogSearchOptions } from '@/lib/types/blog';
import { BlogPost, BlogPostNoAuthor, Category, Tag } from '@/app/types/blog';
import { 
  blogPostsNoAuthor, 
  categoryGroups,
  getPostById as getPostByIdDummy,
  getPostNoAuthorById as getPostNoAuthorByIdDummy
} from '@/app/data/blogData';

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cached items
  enableBackgroundRefresh: boolean;
}

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

// In-flight request tracking for deduplication
interface InFlightRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

/**
 * Enhanced Blog API Service with intelligent caching
 */
class EnhancedBlogService extends BaseApiService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlightRequests = new Map<string, InFlightRequest<unknown>>();
  
  // Cache configurations for different data types
  private cacheConfigs: Record<string, CacheConfig> = {
    posts: { ttl: 5 * 60 * 1000, maxSize: 50, enableBackgroundRefresh: true }, // 5 minutes
    post: { ttl: 10 * 60 * 1000, maxSize: 100, enableBackgroundRefresh: true }, // 10 minutes
    categories: { ttl: 30 * 60 * 1000, maxSize: 10, enableBackgroundRefresh: true }, // 30 minutes
    tags: { ttl: 30 * 60 * 1000, maxSize: 10, enableBackgroundRefresh: true }, // 30 minutes
    popularPosts: { ttl: 15 * 60 * 1000, maxSize: 5, enableBackgroundRefresh: true }, // 15 minutes
    relatedPosts: { ttl: 20 * 60 * 1000, maxSize: 50, enableBackgroundRefresh: false }, // 20 minutes
    search: { ttl: 2 * 60 * 1000, maxSize: 20, enableBackgroundRefresh: false } // 2 minutes
  };

  protected getServiceName(): string {
    return 'EnhancedBlogService';
  }

  /**
   * Get cached data or fetch if not available/expired
   */
  private async getCachedData<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<T> {
    // Check for in-flight request first (deduplication)
    const inFlight = this.inFlightRequests.get(cacheKey) as InFlightRequest<T>;
    if (inFlight) {
      this.log(`Deduplicating request for ${cacheKey}`);
      return await inFlight.promise;
    }

    // Check cache
    const cached = this.cache.get(cacheKey) as CacheEntry<T>;
    const now = Date.now();
    const config = this.cacheConfigs[cacheType];

    if (cached && now < cached.expiresAt) {
      this.log(`Cache hit for ${cacheKey}`);
      
      // Background refresh if enabled and cache is getting old
      if (config.enableBackgroundRefresh && 
          now > cached.timestamp + (config.ttl * 0.8)) {
        this.log(`Triggering background refresh for ${cacheKey}`);
        this.backgroundRefresh(cacheKey, fetchFn, cacheType);
      }
      
      return cached.data;
    }

    // Cache miss or expired - fetch data
    this.log(`Cache miss for ${cacheKey}, fetching...`);
    return await this.fetchAndCache(cacheKey, fetchFn, cacheType);
  }

  /**
   * Fetch data and update cache
   */
  private async fetchAndCache<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    cacheType: keyof typeof this.cacheConfigs
  ): Promise<T> {
    const config = this.cacheConfigs[cacheType];
    
    // Create promise for in-flight tracking
    const promise = this.executeWithRetry(fetchFn, cacheKey);
    
    // Track in-flight request
    this.inFlightRequests.set(cacheKey, {
      promise: promise as Promise<unknown>,
      timestamp: Date.now()
    });

    try {
      const data = await promise;
      
      // Cache the result
      this.setCacheEntry(cacheKey, data, config);
      
      return data;
    } finally {
      // Clean up in-flight tracking
      this.inFlightRequests.delete(cacheKey);
    }
  }

  /**
   * Background refresh for keeping cache fresh
   */
  private backgroundRefresh<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    cacheType: keyof typeof this.cacheConfigs
  ): void {
    // Don't await - this runs in background
    this.fetchAndCache(cacheKey, fetchFn, cacheType)
      .catch(error => {
        this.logError(`Background refresh failed for ${cacheKey}`, error);
      });
  }

  /**
   * Execute function with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    context: string,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry for certain error types
        if (error instanceof ApiError && error.status === 404) {
          throw error;
        }
        
        if (attempt === maxRetries) {
          this.logError(`Final retry failed for ${context}`, error);
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        this.log(`Retry ${attempt}/${maxRetries} for ${context} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Set cache entry with size management
   */
  private setCacheEntry<T>(key: string, data: T, config: CacheConfig): void {
    const now = Date.now();
    
    // Clean old entries if cache is full
    if (this.cache.size >= config.maxSize) {
      this.evictOldEntries(config.maxSize);
    }
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + config.ttl,
      key
    });
    
    this.log(`Cached data for ${key} (TTL: ${config.ttl}ms)`);
  }

  /**
   * Evict old cache entries
   */
  private evictOldEntries(maxSize: number): void {
    if (this.cache.size < maxSize) return;
    
    // Sort by timestamp and remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    const toRemove = entries.slice(0, entries.length - maxSize + 1);
    toRemove.forEach(([key]) => {
      this.cache.delete(key);
      this.log(`Evicted cache entry: ${key}`);
    });
  }

  /**
   * Clear cache for specific patterns
   */
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      this.log('Cleared all cache');
      return;
    }
    
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.includes(pattern));
      
    keysToDelete.forEach(key => this.cache.delete(key));
    this.log(`Cleared cache entries matching pattern: ${pattern}`);
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): Record<string, unknown> {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    
    return {
      totalEntries: this.cache.size,
      expiredEntries: entries.filter(entry => now > entry.expiresAt).length,
      inFlightRequests: this.inFlightRequests.size,
      memoryUsage: JSON.stringify(entries).length, // Rough estimate
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    };
  }

  // Enhanced API methods with caching

  /**
   * Get blog posts with intelligent caching
   */
  async getPosts(params?: BlogPostParams): Promise<PaginatedResponse<BlogPostNoAuthor>> {
    const cacheKey = `posts:${JSON.stringify(params || {})}`;
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
        },
        () => this.getDummyPosts(params),
        'getPosts'
      ),
      'posts'
    );
  }

  /**
   * Get single blog post with caching
   */
  async getPost(id: number, includeAuthor = false): Promise<BlogPost | BlogPostNoAuthor> {
    const cacheKey = `post:${id}:${includeAuthor}`;
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
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
      ),
      'post'
    );
  }

  /**
   * Get categories with long-term caching
   */
  async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories:all';
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
        },
        () => categoryGroups.flatMap(group => group.categories),
        'getCategories'
      ),
      'categories'
    );
  }

  /**
   * Get tags with long-term caching
   */
  async getTags(): Promise<Tag[]> {
    const cacheKey = 'tags:all';
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
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
      ),
      'tags'
    );
  }

  /**
   * Get related posts with caching
   */
  async getRelatedPosts(postId: number, limit = 5): Promise<BlogPostNoAuthor[]> {
    const cacheKey = `relatedPosts:${postId}:${limit}`;
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
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
      ),
      'relatedPosts'
    );
  }

  /**
   * Get popular posts with caching
   */
  async getPopularPosts(limit = 10): Promise<BlogPostNoAuthor[]> {
    const cacheKey = `popularPosts:${limit}`;
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
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
      ),
      'popularPosts'
    );
  }

  /**
   * Search posts with short-term caching
   */
  async searchPosts(query: string, options?: BlogSearchOptions): Promise<BlogPostNoAuthor[]> {
    const cacheKey = `search:${query}:${JSON.stringify(options || {})}`;
    
    return this.getCachedData(
      cacheKey,
      () => this.safeExecute(
        async () => {
          // TODO: Real API call implementation
          throw new Error('API not implemented - using dummy data fallback');
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
      ),
      'search'
    );
  }

  /**
   * Internal dummy data processor with enhanced error handling
   */
  private getDummyPosts(params?: BlogPostParams): PaginatedResponse<BlogPostNoAuthor> {
    try {
      let posts = [...blogPostsNoAuthor];
      
      // Apply filters with validation
      if (params?.categoryId && params.categoryId > 0) {
        posts = posts.filter(p => p.categoryId === params.categoryId);
      }
      if (params?.tagId && params.tagId > 0) {
        posts = posts.filter(p => p.tags.some(t => t.id === params.tagId));
      }
      if (params?.search && params.search.trim()) {
        const term = params.search.toLowerCase().trim();
        posts = posts.filter(p => 
          p.title.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term)
        );
      }
      
      // Sort with validation
      const validSortOrders = ['asc', 'desc'];
      const order = validSortOrders.includes(params?.order || '') 
        ? params?.order as 'asc' | 'desc'
        : 'desc';
      
      posts.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
      
      // Pagination with validation
      const page = Math.max(1, params?.page || 1);
      const pageSize = Math.min(50, Math.max(1, params?.pageSize || 10)); // Max 50 items per page
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
export const blogService = new EnhancedBlogService();

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

// Export service instance for advanced operations
export { blogService as enhancedBlogService };

// Export cache management functions
export const blogCache = {
  clear: (pattern?: string) => blogService.clearCache(pattern),
  stats: () => blogService.getCacheStats()
}; 