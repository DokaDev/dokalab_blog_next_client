/**
 * Category Management Module
 * Centralised category operations, utilities, and business logic
 */

import { Category, CategoryGroup, BlogPost, BlogPostNoAuthor } from '@/app/types/blog';
import { categoryGroups, blogPosts, blogPostsNoAuthor } from '@/app/data/blogData';

// Category statistics interface
export interface CategoryStats {
  id: number;
  name: string;
  description: string;
  postCount: number;
  authorPostCount?: number;
  lastPostDate?: string;
  isActive: boolean;
}

// Category hierarchy interface
export interface CategoryHierarchy {
  group: CategoryGroup;
  totalPosts: number;
  categories: CategoryStats[];
}

// Category search result interface
export interface CategorySearchResult {
  category: Category;
  matchType: 'name' | 'description' | 'both';
  matchScore: number;
  postCount: number;
}

/**
 * Category Service Class
 * Provides comprehensive category management functionality
 */
export class CategoryService {
  private categories: Category[] = [];
  private categoryGroups: CategoryGroup[] = [];

  constructor() {
    this.categoryGroups = categoryGroups;
    this.categories = this.flattenCategories();
  }

  /**
   * Get all categories as flat array
   */
  private flattenCategories(): Category[] {
    return this.categoryGroups.flatMap(group => group.categories);
  }

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    return [...this.categories];
  }

  /**
   * Get all category groups
   */
  getCategoryGroups(): CategoryGroup[] {
    return [...this.categoryGroups];
  }

  /**
   * Find category by ID
   */
  getCategoryById(id: number): Category | null {
    return this.categories.find(category => category.id === id) || null;
  }

  /**
   * Find category by name (case-insensitive)
   */
  getCategoryByName(name: string): Category | null {
    const normalizedName = name.toLowerCase().trim();
    return this.categories.find(category => 
      category.name.toLowerCase() === normalizedName
    ) || null;
  }

  /**
   * Find category group by name
   */
  getCategoryGroupByName(groupName: string): CategoryGroup | null {
    return this.categoryGroups.find(group => 
      group.name.toLowerCase() === groupName.toLowerCase()
    ) || null;
  }

  /**
   * Get categories within a specific group
   */
  getCategoriesInGroup(groupName: string): Category[] {
    const group = this.getCategoryGroupByName(groupName);
    return group ? [...group.categories] : [];
  }

  /**
   * Check if category exists
   */
  categoryExists(id: number): boolean {
    return this.categories.some(category => category.id === id);
  }

  /**
   * Get category statistics with post counts
   */
  getCategoryStats(includeAuthor = false): CategoryStats[] {
    const posts = includeAuthor ? blogPosts : blogPostsNoAuthor;
    
    return this.categories.map(category => {
      const categoryPosts = posts.filter(post => post.categoryId === category.id);
      const lastPost = categoryPosts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )[0];

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        postCount: categoryPosts.length,
        authorPostCount: includeAuthor ? undefined : blogPosts.filter(p => p.categoryId === category.id).length,
        lastPostDate: lastPost ? lastPost.publishedAt : undefined,
        isActive: categoryPosts.length > 0
      };
    });
  }

  /**
   * Get category hierarchy with statistics
   */
  getCategoryHierarchy(includeAuthor = false): CategoryHierarchy[] {
    const posts = includeAuthor ? blogPosts : blogPostsNoAuthor;
    
    return this.categoryGroups.map(group => {
      const groupPosts = posts.filter(post => 
        group.categories.some(cat => cat.id === post.categoryId)
      );
      
      const categoryStats = group.categories.map(category => {
        const categoryPosts = posts.filter(post => post.categoryId === category.id);
        const lastPost = categoryPosts.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )[0];

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          postCount: categoryPosts.length,
          authorPostCount: includeAuthor ? undefined : blogPosts.filter(p => p.categoryId === category.id).length,
          lastPostDate: lastPost ? lastPost.publishedAt : undefined,
          isActive: categoryPosts.length > 0
        };
      });

      return {
        group,
        totalPosts: groupPosts.length,
        categories: categoryStats
      };
    });
  }

  /**
   * Search categories by name or description
   */
  searchCategories(query: string, options: {
    searchIn?: ('name' | 'description')[];
    limit?: number;
    includeEmpty?: boolean;
  } = {}): CategorySearchResult[] {
    const { searchIn = ['name', 'description'], limit = 10, includeEmpty = true } = options;
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return [];
    
    const results: CategorySearchResult[] = [];
    
    this.categories.forEach(category => {
      const postCount = this.getPostCount(category.id);
      
      if (!includeEmpty && postCount === 0) return;
      
      let matchType: 'name' | 'description' | 'both' | null = null;
      let matchScore = 0;
      
      const nameMatch = searchIn.includes('name') && 
        category.name.toLowerCase().includes(normalizedQuery);
      const descMatch = searchIn.includes('description') && 
        category.description.toLowerCase().includes(normalizedQuery);
      
      if (nameMatch && descMatch) {
        matchType = 'both';
        matchScore = 100;
      } else if (nameMatch) {
        matchType = 'name';
        matchScore = 80;
      } else if (descMatch) {
        matchType = 'description';
        matchScore = 60;
      }
      
      if (matchType) {
        // Boost score for exact matches
        if (category.name.toLowerCase() === normalizedQuery) {
          matchScore += 20;
        }
        
        // Boost score for categories with more posts
        matchScore += Math.min(postCount * 2, 10);
        
        results.push({
          category,
          matchType,
          matchScore,
          postCount
        });
      }
    });
    
    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Get posts by category ID
   */
  getPostsByCategory(categoryId: number, includeAuthor = false): BlogPost[] | BlogPostNoAuthor[] {
    const posts = includeAuthor ? blogPosts : blogPostsNoAuthor;
    return posts.filter(post => post.categoryId === categoryId);
  }

  /**
   * Get post count for a category
   */
  getPostCount(categoryId: number, includeAuthor = false): number {
    const posts = includeAuthor ? blogPosts : blogPostsNoAuthor;
    return posts.filter(post => post.categoryId === categoryId).length;
  }

  /**
   * Get related categories based on shared posts or similar descriptions
   */
  getRelatedCategories(categoryId: number, limit = 5): Category[] {
    const targetCategory = this.getCategoryById(categoryId);
    if (!targetCategory) return [];
    
    const targetPosts = this.getPostsByCategory(categoryId, false) as BlogPostNoAuthor[];
    const targetTags = new Set(targetPosts.flatMap(post => post.tags.map(tag => tag.id)));
    
    const similarities = this.categories
      .filter(cat => cat.id !== categoryId)
      .map(category => {
        const categoryPosts = this.getPostsByCategory(category.id, false) as BlogPostNoAuthor[];
        const categoryTags = new Set(categoryPosts.flatMap(post => post.tags.map(tag => tag.id)));
        
        // Calculate tag similarity
        const commonTags = new Set([...targetTags].filter(tag => categoryTags.has(tag)));
        const tagSimilarity = commonTags.size / Math.max(targetTags.size, categoryTags.size);
        
        // Calculate description similarity (simple word matching)
        const targetWords = new Set(targetCategory.description.toLowerCase().split(/\s+/));
        const categoryWords = new Set(category.description.toLowerCase().split(/\s+/));
        const commonWords = new Set([...targetWords].filter(word => categoryWords.has(word)));
        const descSimilarity = commonWords.size / Math.max(targetWords.size, categoryWords.size);
        
        return {
          category,
          similarity: tagSimilarity * 0.7 + descSimilarity * 0.3
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
    
    return similarities.map(item => item.category);
  }

  /**
   * Get popular categories (by post count)
   */
  getPopularCategories(limit = 10, includeAuthor = false): CategoryStats[] {
    return this.getCategoryStats(includeAuthor)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
  }

  /**
   * Get recently active categories (by latest post date)
   */
  getRecentlyActiveCategories(limit = 10, includeAuthor = false): CategoryStats[] {
    return this.getCategoryStats(includeAuthor)
      .filter(cat => cat.lastPostDate)
      .sort((a, b) => {
        const dateA = new Date(a.lastPostDate!).getTime();
        const dateB = new Date(b.lastPostDate!).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Get category breadcrumb path
   */
  getCategoryBreadcrumb(categoryId: number): { group: string; category: Category } | null {
    const category = this.getCategoryById(categoryId);
    if (!category) return null;
    
    const group = this.categoryGroups.find(g => 
      g.categories.some(cat => cat.id === categoryId)
    );
    
    return group ? { group: group.name, category } : null;
  }

  /**
   * Validate category data integrity
   */
  validateCategoryData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for duplicate category IDs
    const categoryIds = this.categories.map(cat => cat.id);
    const uniqueIds = new Set(categoryIds);
    if (categoryIds.length !== uniqueIds.size) {
      errors.push('Duplicate category IDs found');
    }
    
    // Check for duplicate category names
    const categoryNames = this.categories.map(cat => cat.name.toLowerCase());
    const uniqueNames = new Set(categoryNames);
    if (categoryNames.length !== uniqueNames.size) {
      errors.push('Duplicate category names found');
    }
    
    // Check for empty category names or descriptions
    this.categories.forEach(cat => {
      if (!cat.name.trim()) {
        errors.push(`Category ${cat.id} has empty name`);
      }
      if (!cat.description.trim()) {
        errors.push(`Category ${cat.id} has empty description`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get category statistics summary
   */
  getCategoryStatsSummary(includeAuthor = false): {
    totalCategories: number;
    totalGroups: number;
    activeCategories: number;
    emptyCategories: number;
    totalPosts: number;
    averagePostsPerCategory: number;
    mostPopularCategory: CategoryStats | null;
    leastPopularCategory: CategoryStats | null;
  } {
    const stats = this.getCategoryStats(includeAuthor);
    const activeStats = stats.filter(cat => cat.isActive);
    const emptyStats = stats.filter(cat => !cat.isActive);
    
    const totalPosts = stats.reduce((sum, cat) => sum + cat.postCount, 0);
    const sortedByPosts = [...activeStats].sort((a, b) => b.postCount - a.postCount);
    
    return {
      totalCategories: stats.length,
      totalGroups: this.categoryGroups.length,
      activeCategories: activeStats.length,
      emptyCategories: emptyStats.length,
      totalPosts,
      averagePostsPerCategory: totalPosts / stats.length,
      mostPopularCategory: sortedByPosts[0] || null,
      leastPopularCategory: sortedByPosts[sortedByPosts.length - 1] || null
    };
  }
}

// Create singleton instance
export const categoryService = new CategoryService();

// Export individual functions for convenience
export const {
  getCategories,
  getCategoryGroups,
  getCategoryById,
  getCategoryByName,
  getCategoryGroupByName,
  getCategoriesInGroup,
  categoryExists,
  getCategoryStats,
  getCategoryHierarchy,
  searchCategories,
  getPostsByCategory,
  getPostCount,
  getRelatedCategories,
  getPopularCategories,
  getRecentlyActiveCategories,
  getCategoryBreadcrumb,
  validateCategoryData,
  getCategoryStatsSummary
} = categoryService;

// Export utility functions
export const categoryUtils = {
  // Format category name for URL
  formatCategorySlug: (category: Category): string => {
    return category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  },
  
  // Parse category slug back to find category
  findCategoryBySlug: (slug: string): Category | null => {
    return categoryService.getCategories().find(cat => 
      categoryUtils.formatCategorySlug(cat) === slug
    ) || null;
  },
  
  // Get category color/theme class
  getCategoryTheme: (categoryId: number): string => {
    const category = categoryService.getCategoryById(categoryId);
    if (!category) return 'default';
    
    const group = categoryService.getCategoryGroups().find(g => 
      g.categories.some(cat => cat.id === categoryId)
    );
    
    if (!group) return 'default';
    
    // Map group names to themes
    const themeMap: Record<string, string> = {
      'Development': 'blue',
      'AI & Data': 'green',
      'Systems': 'purple',
      'Business': 'orange',
      'Design': 'pink'
    };
    
    return themeMap[group.name] || 'default';
  },
  
  // Check if category is trending (has recent posts)
  isCategoryTrending: (categoryId: number, daysThreshold = 30): boolean => {
    const posts = categoryService.getPostsByCategory(categoryId, false) as BlogPostNoAuthor[];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
    
    return posts.some(post => new Date(post.publishedAt) > cutoffDate);
  }
};

// Export default service instance
export default categoryService; 