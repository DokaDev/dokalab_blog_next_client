'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/app/types/blog';
import { formatDate } from '../../lib/utils';
import styles from './BlogPostCard.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, featured = false }) => {
  const hasImage = post.coverImage && post.coverImage.trim() !== '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTagId = searchParams.get('tag') ? parseInt(searchParams.get('tag') as string, 10) : null;
  const currentCategory = searchParams.get('category');
  
  const handleTagClick = (e: React.MouseEvent, tagId: number) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent event bubbling
    
    // Check if the clicked tag is already active
    const isCurrentlyActive = activeTagId === tagId;
    
    // If already selected tag is clicked again, remove tag filtering
    // Otherwise, filter by the new tag
    let url;
    if (isCurrentlyActive) {
      // Remove tag filtering and maintain only category
      url = currentCategory 
        ? `/blog?category=${currentCategory}`
        : `/blog`;
    } else {
      // Apply filtering with new tag
      url = currentCategory 
        ? `/blog?category=${currentCategory}&tag=${tagId}`
        : `/blog?tag=${tagId}`;
    }
      
    router.push(url);
  };
  
  return (
    <article 
      className={`
        ${styles.postCard} 
        ${!hasImage ? styles.noImageCard : ''} 
        ${featured ? styles.featured : ''}
      `}
    >
      <Link href={`/blog/post/${post.id}`} className={styles.postLink}>
        {hasImage && (
          <div className={styles.imageContainer}>
            <Image
              src={post.coverImage as string}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.coverImage}
            />
            
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag.id} 
                    className={`${styles.tag} ${activeTagId === tag.id ? styles.active : ''}`}
                    onClick={(e) => handleTagClick(e, tag.id)}
                  >
                    {tag.name}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className={styles.tag}>+{post.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className={styles.content}>
          <h2 className={styles.title}>{post.title}</h2>
          
          {!hasImage && post.tags && post.tags.length > 0 && (
            <div className={styles.inlineTags}>
              {post.tags.map((tag) => (
                <span 
                  key={tag.id} 
                  className={`${styles.inlineTag} ${activeTagId === tag.id ? styles.active : ''}`}
                  onClick={(e) => handleTagClick(e, tag.id)}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          <p className={styles.excerpt}>{post.excerpt}</p>
          
          <div className={styles.meta}>
            <div className={styles.author}>
              <div className={styles.avatarContainer}>
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className={styles.avatar}
                />
              </div>
              <span className={styles.authorName}>{post.author.name}</span>
            </div>
            
            <div className={styles.details}>
              <time className={styles.date}>{formatDate(post.publishedAt)}</time>
              <span className={styles.readTime}>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogPostCard; 