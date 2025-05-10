'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
/* COMPONENT SWAP GUIDE:
 * Option 1: For components with author information
 * import { BlogPost } from '@/app/types/blog';
 * import BlogPostCard from './BlogPostCard';
 * 
 * Option 2: For components without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 * import BlogPostCardNoAuthor from './BlogPostCardNoAuthor';
 */
import { BlogPostNoAuthor } from '@/app/types/blog';
import BlogPostCardNoAuthor from './BlogPostCardNoAuthor';
import styles from '../../(global)/blog/page.module.scss';

// Search type definition
type SearchType = 'title' | 'content' | 'both';

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

/* COMPONENT SWAP GUIDE:
 * Option 1: For components with author information
 * interface BlogSearchProps {
 *   posts: BlogPost[];
 *   categoryName?: string;
 * }
 *
 * Option 2: For components without author information
 * interface BlogSearchProps {
 *   posts: BlogPostNoAuthor[];
 *   categoryName?: string;
 * }
 */
interface BlogSearchProps {
  posts: BlogPostNoAuthor[];
  categoryName?: string;
}

export default function BlogSearch({ posts, categoryName = 'All Posts' }: BlogSearchProps) {
  const POSTS_PER_PAGE = 12;
  const [columnCount, setColumnCount] = useState(3); // Default is 3 columns
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get search parameters from URL
  const q = searchParams.get('q') || '';
  const searchType = (searchParams.get('searchType') as SearchType) || 'both';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  
  // Input state for controlled component
  const [searchTerm, setSearchTerm] = useState(q);
  const [searchTypeState, setSearchTypeState] = useState<SearchType>(searchType);
  
  // Update input state when URL params change
  useEffect(() => {
    setSearchTerm(q);
    setSearchTypeState(searchType as SearchType);
  }, [q, searchType]);
  
  // Adjust column count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setColumnCount(1);
      } else if (window.innerWidth <= 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    
    // Initial setup
    handleResize();
    
    // Register resize event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate total pages
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  // Get current page posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Distribute posts in columns for masonry effect while preserving order
  const masonryColumns = useMemo(() => {
    /* COMPONENT SWAP GUIDE:
     * Option 1: For components with author information
     * const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);
     *
     * Option 2: For components without author information
     * const columns = Array.from({ length: columnCount }, () => [] as BlogPostNoAuthor[]);
     */
    const columns = Array.from({ length: columnCount }, () => [] as BlogPostNoAuthor[]);
    
    // Keep track of next column to place a post (zigzag pattern)
    let currentColumn = 0;
    
    // Place posts in columns in sequential order
    currentPosts.forEach(post => {
      columns[currentColumn].push(post);
      currentColumn = (currentColumn + 1) % columnCount;
    });
    
    return columns;
  }, [currentPosts, columnCount]);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Create a new URLSearchParams object based on the current URL
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or add the page parameter
    params.set('page', pageNumber.toString());
    
    // Navigate to the URL with updated parameters
    router.push(`/blog?${params.toString()}`);
    
    // Scroll to top of posts section
    document.querySelector(`.${styles.posts}`)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Perform search
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Create a new URLSearchParams object based on the current URL
    const params = new URLSearchParams(searchParams.toString());
    
    // Update search parameters
    params.set('q', searchTerm);
    params.set('searchType', searchTypeState);
    
    // Reset page to 1 when performing a new search
    params.set('page', '1');
    
    // Navigate to the URL with updated parameters
    router.push(`/blog?${params.toString()}`);
  };
  
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search type change
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchTypeState(e.target.value as SearchType);
  };

  return (
    <>
      <div className={styles.postsHeader}>
        <div className={styles.titleSection}>
          <h2 className={styles.postsTitle}>{categoryName}</h2>
          <div className={styles.postsCount}>{posts.length} articles</div>
        </div>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <select 
              value={searchTypeState} 
              onChange={handleSearchTypeChange}
              className={styles.searchTypeSelect}
            >
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="both">Title & Content</option>
            </select>
            
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search articles..."
              className={styles.searchInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            
            <button 
              onClick={handleSearch}
              className={styles.searchButton}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating pagination UI */}
      {totalPages > 1 && (
        <div className={styles.floatingPagination}>
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`${styles.floatingButton} ${styles.prevButton}`}
          >
            Previous
          </button>
          
          <span className={styles.floatingPageInfo}>
            {currentPage} / {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`${styles.floatingButton} ${styles.nextButton}`}
          >
            Next
          </button>
        </div>
      )}
      
      {posts.length > 0 ? (
        <>
          <div className={styles.masonryGrid}>
            {masonryColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={styles.masonryColumn}>
                {column.map((post, postIndex) => (
                  <div key={post.id} className={styles.postCard}>
                    {/* COMPONENT SWAP GUIDE:
                     * Option 1: For components with author information
                     * <BlogPostCard
                     *   post={post}
                     *   featured={postIndex === 0 && columnIndex === 0}
                     * />
                     *
                     * Option 2: For components without author information
                     * <BlogPostCardNoAuthor
                     *   post={post}
                     *   featured={postIndex === 0 && columnIndex === 0}
                     * />
                     */}
                    <BlogPostCardNoAuthor
                      post={post}
                      featured={postIndex === 0 && columnIndex === 0}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Bottom pagination */}
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
          <p>No search results found.</p>
        </div>
      )}
    </>
  );
} 