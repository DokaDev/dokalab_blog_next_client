'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogPost } from '@/app/types/blog';
import BlogPostCard from './BlogPostCard';
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

interface BlogSearchProps {
  posts: BlogPost[];
  categoryName?: string;
}

export default function BlogSearch({ posts, categoryName = 'All Posts' }: BlogSearchProps) {
  const POSTS_PER_PAGE = 12;
  const [columnCount, setColumnCount] = useState(3); // Default is 3 columns
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('both');
  const [isSearching, setIsSearching] = useState(false);
  
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
  
  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim() || !isSearching) {
      return posts;
    }
    
    const term = searchTerm.toLowerCase();
    return posts.filter(post => {
      if (searchType === 'title') {
        return post.title.toLowerCase().includes(term);
      } else if (searchType === 'content') {
        return post.excerpt.toLowerCase().includes(term);
      } else {
        // Title + Content
        return post.title.toLowerCase().includes(term) || 
               post.excerpt.toLowerCase().includes(term);
      }
    });
  }, [searchTerm, searchType, isSearching, posts]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  // Get current page posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Distribute posts in columns for masonry effect while preserving order
  const masonryColumns = useMemo(() => {
    // Initialize columns array - each column is an array of posts
    const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);
    
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
    setCurrentPage(pageNumber);
    // Scroll to top of posts section
    document.querySelector(`.${styles.posts}`)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Perform search
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setIsSearching(false); // Clear search state when input is empty
    }
  };
  
  // Handle search type change
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType);
  };

  return (
    <>
      <div className={styles.postsHeader}>
        <div className={styles.titleSection}>
          <h2 className={styles.postsTitle}>{categoryName}</h2>
          <div className={styles.postsCount}>{filteredPosts.length} articles</div>
        </div>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <select 
              value={searchType} 
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
      
      {filteredPosts.length > 0 ? (
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