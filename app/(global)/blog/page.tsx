'use client';

import { useState, useMemo } from 'react';
import { blogPosts, categoryGroups } from '@/app/data/blogData';
import CategorySidebar from '@/app/components/blog/CategorySidebar';
import BlogPostCard from '@/app/components/blog/BlogPostCard';
import styles from './page.module.scss';

// Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void 
}) => {
  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Previous
      </button>
      
      <span className={styles.pageInfo}>
        {currentPage} / {totalPages}
      </span>
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next
      </button>
    </div>
  );
};

export default function BlogPage() {
  const POSTS_PER_PAGE = 12;
  const COLUMNS = 3; // Number of columns in the layout
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort posts by date (newest first)
  const sortedPosts = useMemo(() => {
    return [...blogPosts].sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, []);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  
  // Get current page posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Distribute posts in columns for masonry effect while preserving order
  const masonryColumns = useMemo(() => {
    // Initialize columns array - each column is an array of posts
    const columns = Array.from({ length: COLUMNS }, () => [] as typeof blogPosts);
    
    // Keep track of next column to place a post (zigzag pattern)
    let currentColumn = 0;
    
    // Place posts in columns in sequential order
    currentPosts.forEach(post => {
      columns[currentColumn].push(post);
      currentColumn = (currentColumn + 1) % COLUMNS;
    });
    
    return columns;
  }, [currentPosts]);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    document.querySelector(`.${styles.posts}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <CategorySidebar categoryGroups={categoryGroups} />
        </div>
        
        <div className={styles.posts}>
          <div className={styles.postsHeader}>
            <h2 className={styles.postsTitle}>All Posts</h2>
            <div className={styles.postsCount}>{sortedPosts.length} articles</div>
          </div>
          
          {sortedPosts.length > 0 ? (
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
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>No posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

