import { 
  blogPosts, 
  categoryGroups, 
  getCategoryById, 
  getPostsByCategoryId 
  /* COMPONENT SWAP GUIDE:
   * If you want to use the version without author information,
   * import blogPostsNoAuthor and related helper functions:
   * blogPostsNoAuthor,
   */
} from '@/app/data/blogData';
import CategorySidebar from '@/app/components/blog/CategorySidebar';
import BlogSearch from '@/app/components/blog/BlogSearch';
import styles from './page.module.scss';
import { Metadata } from 'next';

/* COMPONENT SWAP GUIDE:
 * If you want to use BlogPostNoAuthor instead of BlogPost, import the appropriate types:
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 */

type PageProps = {
  searchParams: { 
    category?: string;
    tag?: string;
    q?: string;
    searchType?: string;
    page?: string;
  }
};

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const categoryId = searchParams.category ? parseInt(searchParams.category, 10) : null;
  const tagId = searchParams.tag ? parseInt(searchParams.tag, 10) : null;
  const searchQuery = searchParams.q;
  
  // Default title for main blog page
  let title = 'Blog';
  
  // If category is specified, update title to include category name
  if (categoryId !== null) {
    const category = getCategoryById(categoryId);
    if (category) {
      title = `${category.name} - Blog`;
    }
  }

  // If tag is specified, update title to include tag name
  if (tagId !== null) {
    /* COMPONENT SWAP GUIDE:
     * When using blogPostsNoAuthor, replace blogPosts with blogPostsNoAuthor here:
     * const tag = blogPostsNoAuthor.flatMap(post => post.tags).find(tag => tag.id === tagId);
     */
    const tag = blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId);
    if (tag) {
      title = categoryId ? `${title} - Tagged with '${tag.name}'` : `Tagged with '${tag.name}' - Blog`;
    }
  }
  
  // If search query is specified, update title to include search query
  if (searchQuery) {
    title = `Search: ${searchQuery} - ${title}`;
  }
  
  return {
    title,
    description: 'Explore our latest articles, tutorials, and updates',
  };
}

export default function BlogPage({ searchParams }: PageProps) {
  // Check if we have a category filter
  const categoryId = searchParams.category ? parseInt(searchParams.category, 10) : null;
  
  // Check if we have a tag filter
  const tagId = searchParams.tag ? parseInt(searchParams.tag, 10) : null;
  
  // Check if we have a search query
  const searchQuery = searchParams.q || '';
  const searchType = searchParams.searchType || 'both';
  
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * let filteredPosts = [...blogPosts];
   *
   * Option 2: For data without author information
   * let filteredPosts = [...blogPostsNoAuthor];
   */
  let filteredPosts = [...blogPosts];
  let categoryName = 'All Posts';
  
  // First, filter posts by category if specified
  if (categoryId !== null) {
    const category = getCategoryById(categoryId);
    if (category) {
      filteredPosts = getPostsByCategoryId(categoryId);
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

