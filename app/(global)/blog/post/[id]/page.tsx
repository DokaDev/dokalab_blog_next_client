import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getPostNoAuthorById, 
  getAdjacentPostsNoAuthor,
  getPostById,
  getAdjacentPosts,
  getCategoryById
} from '@/app/data/blogData';
import MarkdownRenderer from '@/app/components/markdown/MarkdownRenderer';
import { formatDate } from '@/lib/utils';
import { BlogPost, BlogPostNoAuthor } from '@/app/types/blog';
import styles from './page.module.scss';

// Configuration: Set to true to show author information
const SHOW_AUTHOR_INFO = false;

// ISR Configuration (uncomment when backend is connected)
// export const revalidate = 3600; // Revalidate every hour
// export const dynamicParams = true; // Allow pages not in generateStaticParams

// Type guard to check if post has author
function hasAuthor(post: BlogPost | BlogPostNoAuthor): post is BlogPost {
  return 'author' in post;
}

type PageProps = {
  params: Promise<{ id: string }>
};

// TODO: Rendering strategy for blog posts
// Current: Using dummy data, so any rendering method works
// 
// Future options when backend is connected:
// 1. ISR (Recommended for blog):
//    - export const revalidate = 3600; // Revalidate every hour
//    - Good balance between performance and freshness
// 
// 2. SSG with on-demand revalidation:
//    - Generate popular posts at build time
//    - Use generateStaticParams for top posts only
//    - Trigger revalidation via webhook when content changes
// 
// 3. Full SSR:
//    - Always fresh data but slower
//    - Use only if real-time updates are critical

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = parseInt(id, 10);
  const post = SHOW_AUTHOR_INFO ? getPostById(postId) : getPostNoAuthorById(postId);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  const category = getCategoryById(post.categoryId);
  
  return {
    title: `${post.title} - DokaLab Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: SHOW_AUTHOR_INFO && hasAuthor(post) ? [post.author.name] : ['DokaLab'],
      tags: post.tags.map(tag => tag.name),
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    keywords: [
      ...post.tags.map(tag => tag.name),
      category?.name || '',
      'DokaLab',
      'Tech Blog',
      'Programming',
      'Development'
    ].filter(Boolean),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);
  
  // Validate ID
  if (isNaN(postId)) {
    notFound();
  }
  
  /*
   * API CALL: Get single blog post by ID
   * 
   * GET /api/posts/{postId}
   * 
   * Response:
   * {
   *   "data": {
   *     "id": 1,
   *     "title": "Getting Started with Next.js and TypeScript",
   *     "excerpt": "Learn how to set up a new project with Next.js and TypeScript from scratch.",
   *     "content": "# Full Markdown Content\n\nThis is the complete article content in markdown format...",
   *     "coverImage": "https://example.com/images/nextjs-typescript.jpg",
   *     "categoryId": 1,
   *     "category": {
   *       "id": 1,
   *       "name": "Web Development",
   *       "slug": "web-development"
   *     },
   *     "tags": [
   *       { "id": 1, "name": "React", "slug": "react" },
   *       { "id": 2, "name": "Next.js", "slug": "nextjs" },
   *       { "id": 3, "name": "TypeScript", "slug": "typescript" }
   *     ],
   *     "author": {
   *       "id": 1,
   *       "name": "John Doe",
   *       "avatar": "https://example.com/avatars/john-doe.jpg",
   *       "bio": "Full-stack developer passionate about React and TypeScript",
   *       "social": {
   *         "twitter": "@johndoe",
   *         "github": "johndoe",
   *         "linkedin": "johndoe"
   *       }
   *     },
   *     "publishedAt": "2023-09-15T00:00:00Z",
   *     "updatedAt": "2023-09-16T12:30:00Z",
   *     "readingTime": 8,
   *     "views": 1234,
   *     "likes": 56,
   *     "slug": "getting-started-with-nextjs-typescript",
   *     "seo": {
   *       "metaTitle": "Getting Started with Next.js and TypeScript | DokaLab Blog",
   *       "metaDescription": "A comprehensive guide to setting up Next.js with TypeScript...",
   *       "ogImage": "https://example.com/og/nextjs-typescript.jpg"
   *     },
   *     "relatedPosts": [
   *       {
   *         "id": 2,
   *         "title": "Optimizing React Performance",
   *         "excerpt": "Techniques and best practices to improve your React application performance.",
   *         "coverImage": "https://example.com/images/react-performance.jpg",
   *         "publishedAt": "2023-08-28T00:00:00Z",
   *         "readingTime": 12,
   *         "slug": "optimizing-react-performance"
   *       }
   *     ]
   *   }
   * }
   * 
   * Error Response (404):
   * {
   *   "error": {
   *     "code": "POST_NOT_FOUND",
   *     "message": "The requested blog post could not be found",
   *     "status": 404
   *   }
   * }
   */
  
  const post = SHOW_AUTHOR_INFO ? getPostById(postId) : getPostNoAuthorById(postId);
  
  if (!post) {
    notFound();
  }
  
  const category = getCategoryById(post.categoryId);
  
  /*
   * API CALL: Get adjacent posts (previous and next)
   * 
   * GET /api/posts/{postId}/adjacent
   * 
   * Response:
   * {
   *   "data": {
   *     "previous": {
   *       "id": 0,
   *       "title": "Previous Post Title",
   *       "slug": "previous-post-slug",
   *       "publishedAt": "2023-09-14T00:00:00Z",
   *       "readingTime": 7
   *     },
   *     "next": {
   *       "id": 2,
   *       "title": "Next Post Title",
   *       "slug": "next-post-slug",
   *       "publishedAt": "2023-09-16T00:00:00Z",
   *       "readingTime": 10
   *     }
   *   }
   * }
   */
  const { previous, next } = SHOW_AUTHOR_INFO ? getAdjacentPosts(postId) : getAdjacentPostsNoAuthor(postId);
  
  // Generate sample markdown content since we only have Lorem ipsum
  const sampleMarkdownContent = 
`## Introduction

This is a comprehensive guide that covers the essential concepts and practical applications. Whether you're a beginner or an experienced developer, this article will provide valuable insights and actionable knowledge.

## Key Concepts

### Understanding the Fundamentals

The foundation of any successful implementation lies in understanding the core principles. Let's explore the key concepts that will guide our approach:

- **Concept 1**: Essential building blocks that form the foundation
- **Concept 2**: Advanced techniques for optimization
- **Concept 3**: Best practices for maintainable code

### Practical Implementation

Here's how you can apply these concepts in real-world scenarios:

\`\`\`javascript
// Example implementation
function exampleFunction() {
  console.log("This is a sample code block");
  return "Hello, World!";
}

// Usage
const result = exampleFunction();
console.log(result);
\`\`\`

## Advanced Techniques

:::tip
This is a helpful tip that provides additional context and guidance for better understanding.
:::

:::warning
Be careful when implementing these techniques in production environments. Always test thoroughly.
:::

### Performance Considerations

When working with these technologies, consider the following performance optimizations:

1. **Optimization Strategy 1**: Detailed explanation of the first strategy
2. **Optimization Strategy 2**: How to implement the second approach
3. **Optimization Strategy 3**: Advanced techniques for maximum efficiency

## Mathematical Concepts

Sometimes we need to express complex relationships using mathematical notation:

The fundamental equation can be expressed as: $E = mc^2$

For more complex calculations:

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

## Conclusion

This comprehensive overview provides the foundation you need to get started. Remember to practice these concepts and experiment with different approaches to find what works best for your specific use case.

### Next Steps

- [ ] Practice the basic concepts
- [ ] Implement a simple project
- [ ] Explore advanced features
- [ ] Share your learnings with the community

## Additional Resources

For further reading and deeper understanding, check out these resources:

- [Official Documentation](https://example.com)
- [Community Forum](https://example.com)
- [Advanced Tutorials](https://example.com)

---

*Thank you for reading! If you found this article helpful, please share it with others who might benefit from this knowledge.*`;

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        <Link href="/blog" className={styles.breadcrumbLink}>
          Blog
        </Link>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        {category && (
          <>
            <Link 
              href={`/blog?category=${category.id}`} 
              className={styles.breadcrumbLink}
            >
              {category.name}
            </Link>
            <span className={styles.breadcrumbSeparator}>&gt;</span>
          </>
        )}
        <span className={styles.breadcrumbCurrent}>{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className={styles.articleHeader}>
        {/* Title */}
        <h1 className={styles.title}>{post.title}</h1>

        {/* Meta Information */}
        <div className={styles.meta}>
          {SHOW_AUTHOR_INFO && hasAuthor(post) && (
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
            <time className={styles.metaValue}>{formatDate(post.publishedAt)}</time>
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

      {/* Article Content */}
      <article className={styles.articleContent}>
        <MarkdownRenderer content={sampleMarkdownContent} />
      </article>

      {/* Navigation to Previous/Next Posts */}
      <nav className={styles.postNavigation}>
        <div className={styles.navigationGrid}>
          {/* Previous Post - Always show, either with content or as disabled */}
          {previous ? (
            <Link href={`/blog/post/${previous.id}`} className={styles.navCard}>
              <div className={styles.navDirection}>← Previous</div>
              <div className={styles.navTitle}>{previous.title}</div>
              <div className={styles.navMeta}>
                {formatDate(previous.publishedAt)} • {previous.readingTime} min read
              </div>
            </Link>
          ) : (
            <div className={`${styles.navCard} ${styles.navCardDisabled}`}>
              <div className={styles.navDirection}>← Previous</div>
              <div className={styles.navTitle}>No previous post</div>
              <div className={styles.navMeta}>This is the first post</div>
            </div>
          )}
          
          {/* Next Post - Always show, either with content or as disabled */}
          {next ? (
            <Link href={`/blog/post/${next.id}`} className={styles.navCard}>
              <div className={styles.navDirection}>Next →</div>
              <div className={styles.navTitle}>{next.title}</div>
              <div className={styles.navMeta}>
                {formatDate(next.publishedAt)} • {next.readingTime} min read
              </div>
            </Link>
          ) : (
            <div className={`${styles.navCard} ${styles.navCardDisabled}`}>
              <div className={styles.navDirection}>Next →</div>
              <div className={styles.navTitle}>No next post</div>
              <div className={styles.navMeta}>This is the latest post</div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
} 