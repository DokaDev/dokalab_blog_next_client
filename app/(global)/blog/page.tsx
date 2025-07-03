import { 
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * blogPosts, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsByCategoryId
   *
   * Option 2: For data without author information
   * blogPostsNoAuthor, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsNoAuthorByCategoryId
   */
  blogPostsNoAuthor, 
  categoryGroups, 
  getCategoryById, 
  getPostsNoAuthorByCategoryId
} from '@/app/data/blogData';
import CategorySidebar from '@/app/components/blog/CategorySidebar';
import BlogSearch from '@/app/components/blog/BlogSearch';
import { generateBlogListingMetadata } from '@/lib/metadata/generator';
import styles from './page.module.scss';
import { Metadata } from 'next';

/* COMPONENT SWAP GUIDE:
 * Option 1: For data with author information
 * import { BlogPost } from '@/app/types/blog';
 *
 * Option 2: For data without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 */
// Note: The actual import is commented out as it's used indirectly through the BlogSearch component
// Import will be needed when performing the swap
// import { BlogPostNoAuthor } from '@/app/types/blog';

// Blog list page uses dynamic rendering for search and filtering
// Next.js will automatically optimize based on usage

type PageProps = {
  searchParams: Promise<{ 
    category?: string;
    tag?: string;
    q?: string;
    searchType?: string;
    page?: string;
  }>
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category, 10) : null;
  const tagId = params.tag ? parseInt(params.tag, 10) : null;
  const searchQuery = params.q;
  const searchType = params.searchType;
  
  // Get category and tag objects for metadata generation
  const category = categoryId !== null ? getCategoryById(categoryId) : null;
  
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * const tag = tagId !== null ? blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId) : null;
   *
   * Option 2: For data without author information
   * const tag = tagId !== null ? blogPostsNoAuthor.flatMap(post => post.tags).find(tag => tag.id === tagId) : null;
   */
  const tag = tagId !== null 
    ? blogPostsNoAuthor.flatMap(post => post.tags).find(tag => tag.id === tagId) 
    : null;
  
  return generateBlogListingMetadata({
    categoryId,
    tagId,
    searchQuery,
    searchType,
    category,
    tag
  });
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Check if we have a category filter
  const categoryId = params.category ? parseInt(params.category, 10) : null;
  
  // Check if we have a tag filter
  const tagId = params.tag ? parseInt(params.tag, 10) : null;
  
  // Check if we have a search query
  const searchQuery = params.q || '';
  const searchType = params.searchType || 'both';
  // const page = params.page ? parseInt(params.page, 10) : 1; // TODO: Add pagination support
  
  /* 
   * API CALL: Get blog posts with filters
   * 
   * GET /api/posts?category={categoryId}&tag={tagId}&q={searchQuery}&searchType={searchType}&page={page}&pageSize=10
   * 
   * Response:
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "title": "Getting Started with Next.js",
   *       "excerpt": "Learn how to build modern web applications...",
   *       "content": "Full markdown content here...",
   *       "coverImage": "https://example.com/image.jpg",
   *       "categoryId": 1,
   *       "tags": [
   *         { "id": 1, "name": "React", "slug": "react" },
   *         { "id": 2, "name": "Next.js", "slug": "nextjs" }
   *       ],
   *       "publishedAt": "2023-09-15T00:00:00Z",
   *       "updatedAt": "2023-09-16T00:00:00Z",
   *       "readingTime": 8,
   *       "views": 1234,
   *       "likes": 56,
   *       "slug": "getting-started-with-nextjs"
   *     }
   *   ],
   *   "pagination": {
   *     "total": 150,
   *     "page": 1,
   *     "pageSize": 10,
   *     "totalPages": 15,
   *     "hasNext": true,
   *     "hasPrev": false
   *   },
   *   "filters": {
   *     "category": { "id": 1, "name": "Web Development" },
   *     "tag": null,
   *     "searchQuery": ""
   *   }
   * }
   */
  
  /*
   * API CALL: Get all categories (for metadata)
   * 
   * GET /api/categories
   * 
   * Response:
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "Web Development",
   *       "slug": "web-development",
   *       "description": "Articles about frontend and backend web development",
   *       "postCount": 45,
   *       "parentId": null,
   *       "children": []
   *     }
   *   ]
   * }
   */
  
  /*
   * API CALL: Get all tags (if needed for metadata)
   * 
   * GET /api/tags
   * 
   * Response:
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "React",
   *       "slug": "react",
   *       "postCount": 23
   *     }
   *   ]
   * }
   */
  
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * let filteredPosts = [...blogPosts];
   *
   * Option 2: For data without author information
   * let filteredPosts = [...blogPostsNoAuthor];
   */
  let filteredPosts = [...blogPostsNoAuthor];
  let categoryName = 'All Posts';
  
  // First, filter posts by category if specified
  if (categoryId !== null) {
    const category = getCategoryById(categoryId);
    if (category) {
      /* COMPONENT SWAP GUIDE:
       * Option 1: For data with author information
       * filteredPosts = getPostsByCategoryId(categoryId);
       *
       * Option 2: For data without author information
       * filteredPosts = getPostsNoAuthorByCategoryId(categoryId);
       */
      filteredPosts = getPostsNoAuthorByCategoryId(categoryId);
      categoryName = category.name;
    }
  }
  
  // Then filter by tag within the already filtered posts if specified
  if (tagId !== null) {
    const tagName = filteredPosts.flatMap(post => post.tags).find(tag => tag.id === tagId)?.name;
    filteredPosts = filteredPosts.filter(post => post.tags.some(tag => tag.id === tagId));
    if (tagName) {
      categoryName = categoryId !== null 
        ? `${categoryName} - Tagged with '${tagName}'` 
        : `Tagged with '${tagName}'`;
    }
  }
  
  // Apply search filter if query exists
  if (searchQuery.trim()) {
    const term = searchQuery.toLowerCase();
    
    filteredPosts = filteredPosts.filter(post => {
      if (searchType === 'title') {
        return post.title.toLowerCase().includes(term);
      } else if (searchType === 'content') {
        return post.excerpt.toLowerCase().includes(term) || 
               (post.content && post.content.toLowerCase().includes(term));
      } else {
        // Title + Content (both)
        return post.title.toLowerCase().includes(term) || 
               post.excerpt.toLowerCase().includes(term) ||
               (post.content && post.content.toLowerCase().includes(term));
      }
    });
    
    // Update category name to show search status
    categoryName = searchQuery.trim() 
      ? `${categoryName} - Search: "${searchQuery}"` 
      : categoryName;
  }
  
  // Sort posts by date (newest first)
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <CategorySidebar 
            categoryGroups={categoryGroups} 
            selectedCategoryId={categoryId} 
          />
        </div>
        
        <div className={styles.posts}>
          {/* COMPONENT SWAP GUIDE:
           * When using BlogPostCardNoAuthor component in BlogSearch.tsx,
           * make sure you're passing the appropriate data type here (BlogPostNoAuthor[] instead of BlogPost[])
           */}
          <BlogSearch 
            posts={sortedPosts} 
            categoryName={categoryName} 
          />
        </div>
      </div>
    </div>
  );
}

