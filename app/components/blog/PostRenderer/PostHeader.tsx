/**
 * PostHeader Component
 * Renders blog post header with title, metadata, and tags
 * Supports optional author information display
 */

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost, BlogPostNoAuthor, Category } from '@/app/types/blog';
import { formatDate } from '@/lib/utils';
import styles from './PostRenderer.module.scss';

interface PostHeaderProps {
  post: BlogPost | BlogPostNoAuthor;
  category?: Category | null;
  showAuthor?: boolean;
}

// Type guard to check if post has author
function hasAuthor(post: BlogPost | BlogPostNoAuthor): post is BlogPost {
  return 'author' in post;
}

export default function PostHeader({ post, category, showAuthor = false }: PostHeaderProps) {
  return (
    <header className={styles.articleHeader}>
      {/* Post Title */}
      <h1 className={styles.title}>{post.title}</h1>

      {/* Meta Information */}
      <div className={styles.meta}>
        {showAuthor && hasAuthor(post) && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Author</span>
            <div className={styles.authorInfo}>
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className={styles.authorAvatar}
              />
              <span className={styles.metaValue}>{post.author.name}</span>
            </div>
          </div>
        )}
        
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Published</span>
          <time className={styles.metaValue} dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Reading Time</span>
          <span className={styles.metaValue}>{post.readingTime} min read</span>
        </div>
        
        {category && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <Link 
              href={`/blog?category=${category.id}`}
              className={styles.categoryLink}
            >
              {category.name}
            </Link>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.id}`}
              className={styles.tag}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
} 