/**
 * PostNavigation Component
 * Renders navigation links to previous and next posts
 * Shows disabled state when no adjacent posts exist
 */

import Link from 'next/link';
import { BlogPost, BlogPostNoAuthor } from '@/app/types/blog';
import { formatDate } from '@/lib/utils';
import styles from './PostRenderer.module.scss';

interface PostNavigationProps {
  previous?: BlogPost | BlogPostNoAuthor | null;
  next?: BlogPost | BlogPostNoAuthor | null;
}

export default function PostNavigation({ previous, next }: PostNavigationProps) {
  return (
    <nav className={styles.postNavigation} aria-label="Post navigation">
      <div className={styles.navigationGrid}>
        {/* Previous Post */}
        {previous ? (
          <Link 
            href={`/blog/post/${previous.id}`} 
            className={styles.navCard}
            aria-label={`Previous post: ${previous.title}`}
          >
            <div className={styles.navDirection}>← Previous</div>
            <div className={styles.navTitle}>{previous.title}</div>
            <div className={styles.navMeta}>
              {formatDate(previous.publishedAt)} • {previous.readingTime} min read
            </div>
          </Link>
        ) : (
          <div 
            className={`${styles.navCard} ${styles.navCardDisabled}`}
            aria-disabled="true"
          >
            <div className={styles.navDirection}>← Previous</div>
            <div className={styles.navTitle}>No previous post</div>
            <div className={styles.navMeta}>This is the first post</div>
          </div>
        )}
        
        {/* Next Post */}
        {next ? (
          <Link 
            href={`/blog/post/${next.id}`} 
            className={styles.navCard}
            aria-label={`Next post: ${next.title}`}
          >
            <div className={styles.navDirection}>Next →</div>
            <div className={styles.navTitle}>{next.title}</div>
            <div className={styles.navMeta}>
              {formatDate(next.publishedAt)} • {next.readingTime} min read
            </div>
          </Link>
        ) : (
          <div 
            className={`${styles.navCard} ${styles.navCardDisabled}`}
            aria-disabled="true"
          >
            <div className={styles.navDirection}>Next →</div>
            <div className={styles.navTitle}>No next post</div>
            <div className={styles.navMeta}>This is the latest post</div>
          </div>
        )}
      </div>
    </nav>
  );
} 