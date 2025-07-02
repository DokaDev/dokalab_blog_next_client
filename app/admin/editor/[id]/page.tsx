'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../page.module.scss';
import MarkdownEditor from '@/app/components/admin/markdown/MarkdownEditor';

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number | null;
  tags: string[];
  coverImage: string;
  status: 'draft' | 'published';
}

export default function PostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: null,
    tags: [],
    coverImage: '',
    status: 'draft'
  });

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params;
      setPostId(id);

      if (id === 'new') {
        setIsLoading(false);
        return;
      }

      /*
       * API CALL: Get post for editing
       * 
       * GET /api/admin/posts/{postId}
       * 
       * Headers:
       * {
       *   "Authorization": "Bearer {admin_token}"
       * }
       * 
       * Response:
       * {
       *   "data": {
       *     "id": 1,
       *     "title": "Getting Started with Next.js",
       *     "excerpt": "Learn how to build modern web applications...",
       *     "content": "# Full Markdown Content...",
       *     "coverImage": "https://example.com/image.jpg",
       *     "categoryId": 1,
       *     "category": { "id": 1, "name": "Web Development" },
       *     "tags": ["React", "Next.js", "TypeScript"],
       *     "status": "published",
       *     "publishedAt": "2023-09-15T00:00:00Z",
       *     "updatedAt": "2023-09-16T12:30:00Z",
       *     "author": {
       *       "id": 1,
       *       "name": "John Doe"
       *     },
       *     "seo": {
       *       "metaTitle": "Custom SEO Title",
       *       "metaDescription": "Custom SEO Description",
       *       "ogImage": "https://example.com/og-image.jpg"
       *     }
       *   }
       * }
       */

      // Simulate loading existing post
      setIsLoading(false);
    };

    loadPost();
  }, [params]);

  const handleSave = async () => {
    setIsSaving(true);

    if (postId === 'new') {
      /*
       * API CALL: Create new post
       * 
       * POST /api/admin/posts
       * 
       * Headers:
       * {
       *   "Authorization": "Bearer {admin_token}",
       *   "Content-Type": "application/json"
       * }
       * 
       * Request Body:
       * {
       *   "title": "New Blog Post Title",
       *   "excerpt": "Brief description of the post...",
       *   "content": "# Full Markdown Content...",
       *   "coverImage": "https://example.com/image.jpg",
       *   "categoryId": 1,
       *   "tags": ["React", "Next.js"],
       *   "status": "draft",
       *   "seo": {
       *     "metaTitle": "Custom SEO Title (optional)",
       *     "metaDescription": "Custom SEO Description (optional)",
       *     "ogImage": "https://example.com/og-image.jpg (optional)"
       *   }
       * }
       * 
       * Success Response (201):
       * {
       *   "success": true,
       *   "message": "Post created successfully",
       *   "data": {
       *     "id": 31,
       *     "slug": "new-blog-post-title",
       *     "publishedAt": null,
       *     "createdAt": "2023-09-20T10:00:00Z"
       *   }
       * }
       * 
       * Validation Error Response (400):
       * {
       *   "success": false,
       *   "error": {
       *     "code": "VALIDATION_ERROR",
       *     "message": "Invalid post data",
       *     "fields": {
       *       "title": "Title is required",
       *       "categoryId": "Please select a category"
       *     }
       *   }
       * }
       */
    } else {
      /*
       * API CALL: Update existing post
       * 
       * PUT /api/admin/posts/{postId}
       * 
       * Headers:
       * {
       *   "Authorization": "Bearer {admin_token}",
       *   "Content-Type": "application/json"
       * }
       * 
       * Request Body: (Same as create)
       * 
       * Success Response (200):
       * {
       *   "success": true,
       *   "message": "Post updated successfully",
       *   "data": {
       *     "id": 1,
       *     "slug": "getting-started-with-nextjs",
       *     "publishedAt": "2023-09-15T00:00:00Z",
       *     "updatedAt": "2023-09-20T10:00:00Z"
       *   }
       * }
       */
    }

    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      router.push('/admin/posts');
    }, 1000);
  };

  const handlePublish = async () => {
    /*
     * API CALL: Publish post
     * 
     * POST /api/admin/posts/{postId}/publish
     * 
     * Headers:
     * {
     *   "Authorization": "Bearer {admin_token}"
     * }
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Post published successfully",
     *   "data": {
     *     "id": 1,
     *     "publishedAt": "2023-09-20T10:00:00Z",
     *     "status": "published"
     *   }
     * }
     */
  };

  const handleDelete = async () => {
    /*
     * API CALL: Delete post
     * 
     * DELETE /api/admin/posts/{postId}
     * 
     * Headers:
     * {
     *   "Authorization": "Bearer {admin_token}"
     * }
     * 
     * Success Response (200):
     * {
     *   "success": true,
     *   "message": "Post deleted successfully"
     * }
     */
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="subPage">
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin/posts" className={styles.backLink}>
            ← Back to Posts
          </Link>
          
          <h1 className={styles.title}>
            {postId === 'new' ? 'Create New Post' : 'Edit Post'}
          </h1>
          
          <div className={styles.actions}>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            {postData.status === 'draft' && (
              <button 
                onClick={handlePublish}
                className={styles.publishButton}
              >
                Publish
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.editorForm}>
          <input
            type="text"
            placeholder="Post Title"
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            className={styles.titleInput}
          />
          
          <textarea
            placeholder="Brief excerpt..."
            value={postData.excerpt}
            onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
            className={styles.excerptInput}
            rows={3}
          />
          
          <MarkdownEditor 
            initialContent={postData.content}
            onChange={(content) => setPostData({ ...postData, content })}
          />
        </div>
      </div>
    </main>
  );
} 