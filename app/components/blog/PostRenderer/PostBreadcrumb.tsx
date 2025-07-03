/**
 * PostBreadcrumb Component
 * Renders breadcrumb navigation for blog posts
 * Shows hierarchical path: Home > Blog > Category > Post
 */

import Link from 'next/link';
import { Category } from '@/app/types/blog';
import styles from './PostRenderer.module.scss';

interface PostBreadcrumbProps {
  postTitle: string;
  category?: Category | null;
}

export default function PostBreadcrumb({ postTitle, category }: PostBreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb navigation">
      <Link href="/" className={styles.breadcrumbLink}>
        Home
      </Link>
      <span className={styles.breadcrumbSeparator} aria-hidden="true">&gt;</span>
      <Link href="/blog" className={styles.breadcrumbLink}>
        Blog
      </Link>
      {category && (
        <>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">&gt;</span>
          <Link 
            href={`/blog?category=${category.id}`} 
            className={styles.breadcrumbLink}
          >
            {category.name}
          </Link>
        </>
      )}
      <span className={styles.breadcrumbSeparator} aria-hidden="true">&gt;</span>
      <span className={styles.breadcrumbCurrent}>{postTitle}</span>
    </nav>
  );
} 