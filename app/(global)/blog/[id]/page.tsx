import { notFound } from 'next/navigation';
import { categoryGroups, getCategoryById, getPostsByCategoryId } from '@/app/data/blogData';
import CategorySidebar from '@/app/components/blog/CategorySidebar';
import BlogPostCard from '@/app/components/blog/BlogPostCard';
import styles from '../page.module.scss';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const POSTS_PER_PAGE = 12;
  const COLUMNS = 3; // Number of columns in the layout
  
  const categoryId = parseInt(params.id, 10);
  
  // Get category data
  const category = getCategoryById(categoryId);
  if (!category) {
    notFound();
  }
  
  // Get posts for this category and sort by publishedAt (newest first)
  const categoryPosts = getPostsByCategoryId(categoryId).sort((a, b) => {
    // Parse dates and sort in descending order (newest first)
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  // For initial server render, show first page
  const currentPage = 1;
  
  // Get current page posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = categoryPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Distribute posts in columns for masonry effect while preserving order
  const masonryColumns = Array.from({ length: COLUMNS }, () => [] as typeof categoryPosts);
  
  // Keep track of next column to place a post (zigzag pattern)
  let currentColumn = 0;
  
  // Place posts in columns in sequential order
  currentPosts.forEach(post => {
    masonryColumns[currentColumn].push(post);
    currentColumn = (currentColumn + 1) % COLUMNS;
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <CategorySidebar categoryGroups={categoryGroups} />
        </div>
        
        <div className={styles.posts}>
          <div className={styles.postsHeader}>
            <h2 className={styles.postsTitle}>{category.name}</h2>
            <div className={styles.postsCount}>{categoryPosts.length} articles</div>
          </div>
          
          {categoryPosts.length > 0 ? (
            <>
              <div className={styles.masonryGrid}>
                {masonryColumns.map((column, columnIndex) => (
                  <div key={`column-${columnIndex}`} className={styles.masonryColumn}>
                    {column.map((post, postIndex) => (
                      <div key={post.id} className={styles.postCard}>
                        <BlogPostCard
                          post={post}
                          featured={postIndex === 0 && columnIndex === 0}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Pagination removed as it requires client-side state */}
              {/* For pagination, we would need to add a client component */}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>No posts found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate static params for categories - this improves performance by pre-rendering pages at build time
export function generateStaticParams() {
  const allCategoryIds: string[] = [];
  
  categoryGroups.forEach(group => {
    group.categories.forEach(category => {
      allCategoryIds.push(category.id.toString());
    });
  });
  
  return allCategoryIds.map(id => ({
    id
  }));
} 