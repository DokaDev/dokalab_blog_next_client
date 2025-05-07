'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CategoryGroup } from '@/app/types/blog';
import { getPostsByCategoryId, blogPosts } from '@/app/data/blogData';
import styles from './CategorySidebar.module.scss';

interface CategorySidebarProps {
  categoryGroups: CategoryGroup[];
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categoryGroups }) => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // By default, expand all category groups
    return categoryGroups.reduce((acc, group) => {
      acc[group.name] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isActiveCategory = (categoryId: number): boolean => {
    return pathname === `/blog/${categoryId}`;
  };

  // Check if we're on the main blog page
  const isAllPostsActive = (): boolean => {
    return pathname === '/blog';
  };

  // Get post count for each category
  const getCategoryPostCount = (categoryId: number): number => {
    return getPostsByCategoryId(categoryId).length;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Categories</h2>
      </div>
      
      <nav className={styles.categoryNav}>
        {/* All Posts Link */}
        <div className={styles.allPostsLink}>
          <Link 
            href="/blog"
            className={`${styles.categoryLink} ${isAllPostsActive() ? styles.active : ''}`}
          >
            All Posts
            <span className={styles.categoryCount}>
              {blogPosts.length}
            </span>
          </Link>
        </div>

        <ul className={styles.categoryGroups}>
          {categoryGroups.map((group) => (
            <li key={group.name} className={styles.categoryGroupItem}>
              <div 
                className={styles.categoryGroupHeader}
                onClick={() => toggleGroup(group.name)}
              >
                <span className={styles.groupName}>{group.name}</span>
                <span className={`${styles.toggleIcon} ${expandedGroups[group.name] ? styles.expanded : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
                  </svg>
                </span>
              </div>
              
              <ul className={styles.categoryList}>
                {group.categories.map((category) => (
                  <li key={category.id} className={styles.categoryItem}>
                    <Link 
                      href={`/blog/${category.id}`}
                      className={`${styles.categoryLink} ${isActiveCategory(category.id) ? styles.active : ''}`}
                      title={category.description}
                    >
                      {category.name}
                      <span className={styles.categoryCount}>
                        {getCategoryPostCount(category.id)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default CategorySidebar; 