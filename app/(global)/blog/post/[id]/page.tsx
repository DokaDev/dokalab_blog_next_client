import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { 
  getPostNoAuthorById, 
  getAdjacentPostsNoAuthor,
  getPostById,
  getAdjacentPosts,
  getCategoryById
} from '@/app/data/blogData';
import PostRenderer from '@/app/components/blog/PostRenderer';
import { generateBlogPostMetadata, generateErrorPageMetadata } from '@/lib/metadata/generator';

// Configuration: Set to true to show author information
const SHOW_AUTHOR_INFO = false;

// ISR Configuration (uncomment when backend is connected)
// export const revalidate = 3600; // Revalidate every hour
// export const dynamicParams = true; // Allow pages not in generateStaticParams

// Type guard removed - now handled in metadata generator

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

// Generate metadata for SEO using centralised generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = parseInt(id, 10);
  
  // Validate ID format
  if (isNaN(postId)) {
    return generateErrorPageMetadata(404);
  }
  
  const post = SHOW_AUTHOR_INFO ? getPostById(postId) : getPostNoAuthorById(postId);
  
  if (!post) {
    return generateErrorPageMetadata(404);
  }
  
  const category = getCategoryById(post.categoryId);
  
  return generateBlogPostMetadata({
    post,
    category,
    showAuthor: SHOW_AUTHOR_INFO
  });
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
  
  return (
    <PostRenderer
      post={post}
      category={category}
      adjacentPosts={{ previous, next }}
      showAuthor={SHOW_AUTHOR_INFO}
    />
  );
} 