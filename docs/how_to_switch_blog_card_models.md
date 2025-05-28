# How to Switch Between Blog Card Models

This guide explains how to switch between blog post cards with author information and without author information in the DokaLab Blog project.

## Overview

The blog system supports two different card models:
- **With Author Information**: Shows author avatar, name, and publication details
- **Without Author Information**: Shows only post content, tags, and publication date

## Prerequisites

Before starting, ensure you have:
- Basic understanding of file editing
- Access to the project files
- Text editor or IDE

## Step-by-Step Guide

### Step 1: Modify the Blog Page Data Source

**File to edit**: `app/(global)/blog/page.tsx`

#### 1.1 Change Import Statements

**Find this code block** (around lines 1-18):
```typescript
import { 
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * blogPosts, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsByCategoryId
   *
   * Option 2: For data without author information
   * blogPostsNoAuthor, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsNoAuthorByCategoryId
   */
  blogPosts, 
  categoryGroups, 
  getCategoryById, 
  getPostsByCategoryId
} from '@/app/data/blogData';
```

**To switch to WITHOUT author information, replace with**:
```typescript
import { 
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * blogPosts, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsByCategoryId
   *
   * Option 2: For data without author information
   * blogPostsNoAuthor, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsNoAuthorByCategoryId
   */
  blogPostsNoAuthor, 
  categoryGroups, 
  getCategoryById, 
  getPostsNoAuthorByCategoryId
} from '@/app/data/blogData';
```

**To switch to WITH author information, replace with**:
```typescript
import { 
  /* COMPONENT SWAP GUIDE:
   * Option 1: For data with author information
   * blogPosts, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsByCategoryId
   *
   * Option 2: For data without author information
   * blogPostsNoAuthor, 
   * categoryGroups, 
   * getCategoryById, 
   * getPostsNoAuthorByCategoryId
   */
  blogPosts, 
  categoryGroups, 
  getCategoryById, 
  getPostsByCategoryId
} from '@/app/data/blogData';
```

#### 1.2 Update Type Comment

**Find this code block** (around lines 25-35):
```typescript
/* COMPONENT SWAP GUIDE:
 * Option 1: For data with author information
 * import { BlogPost } from '@/app/types/blog';
 *
 * Option 2: For data without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 */
// Note: The actual import is commented out as it's used indirectly through the BlogSearch component
// Import will be needed when performing the swap
// import { BlogPost } from '@/app/types/blog';
```

**To switch to WITHOUT author information, replace with**:
```typescript
/* COMPONENT SWAP GUIDE:
 * Option 1: For data with author information
 * import { BlogPost } from '@/app/types/blog';
 *
 * Option 2: For data without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 */
// Note: The actual import is commented out as it's used indirectly through the BlogSearch component
// Import will be needed when performing the swap
// import { BlogPostNoAuthor } from '@/app/types/blog';
```

**To switch to WITH author information, replace with**:
```typescript
/* COMPONENT SWAP GUIDE:
 * Option 1: For data with author information
 * import { BlogPost } from '@/app/types/blog';
 *
 * Option 2: For data without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 */
// Note: The actual import is commented out as it's used indirectly through the BlogSearch component
// Import will be needed when performing the swap
// import { BlogPost } from '@/app/types/blog';
```

#### 1.3 Update Tag Finding Logic

**Find this code block** (around lines 60-67):
```typescript
    const tag = blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId);
```

**To switch to WITHOUT author information, replace with**:
```typescript
    const tag = blogPostsNoAuthor.flatMap(post => post.tags).find(tag => tag.id === tagId);
```

**To switch to WITH author information, replace with**:
```typescript
    const tag = blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId);
```

#### 1.4 Update Initial Posts Array

**Find this code block** (around lines 85-92):
```typescript
  let filteredPosts = [...blogPosts];
```

**To switch to WITHOUT author information, replace with**:
```typescript
  let filteredPosts = [...blogPostsNoAuthor];
```

**To switch to WITH author information, replace with**:
```typescript
  let filteredPosts = [...blogPosts];
```

#### 1.5 Update Category Filtering Function

**Find this code block** (around lines 105-112):
```typescript
      filteredPosts = getPostsByCategoryId(categoryId);
```

**To switch to WITHOUT author information, replace with**:
```typescript
      filteredPosts = getPostsNoAuthorByCategoryId(categoryId);
```

**To switch to WITH author information, replace with**:
```typescript
      filteredPosts = getPostsByCategoryId(categoryId);
```

### Step 2: Modify the Blog Search Component

**File to edit**: `app/components/blog/BlogSearch.tsx`

#### 2.1 Change Import Statements

**Find this code block** (around lines 5-15):
```typescript
/* COMPONENT SWAP GUIDE:
 * Option 1: For components with author information
 * import { BlogPost } from '@/app/types/blog';
 * import BlogPostCard from './BlogPostCard';
 * 
 * Option 2: For components without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 * import BlogPostCardNoAuthor from './BlogPostCardNoAuthor';
 */
import { BlogPost } from '@/app/types/blog';
import BlogPostCard from './BlogPostCard';
```

**To switch to WITHOUT author information, replace with**:
```typescript
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
```

**To switch to WITH author information, replace with**:
```typescript
/* COMPONENT SWAP GUIDE:
 * Option 1: For components with author information
 * import { BlogPost } from '@/app/types/blog';
 * import BlogPostCard from './BlogPostCard';
 * 
 * Option 2: For components without author information
 * import { BlogPostNoAuthor } from '@/app/types/blog';
 * import BlogPostCardNoAuthor from './BlogPostCardNoAuthor';
 */
import { BlogPost } from '@/app/types/blog';
import BlogPostCard from './BlogPostCard';
```

#### 2.2 Update Props Interface

**Find this code block** (around lines 50-60):
```typescript
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
  posts: BlogPost[];
  categoryName?: string;
}
```

**To switch to WITHOUT author information, replace with**:
```typescript
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
```

**To switch to WITH author information, replace with**:
```typescript
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
  posts: BlogPost[];
  categoryName?: string;
}
```

#### 2.3 Update Column Array Type

**Find this code block** (around lines 110-117):
```typescript
    const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);
```

**To switch to WITHOUT author information, replace with**:
```typescript
    const columns = Array.from({ length: columnCount }, () => [] as BlogPostNoAuthor[]);
```

**To switch to WITH author information, replace with**:
```typescript
    const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);
```

#### 2.4 Update Card Component Usage

**Find this code block** (around lines 250-270):
```typescript
                    <BlogPostCard
                      post={post}
                      featured={postIndex === 0 && columnIndex === 0}
                    />
```

**To switch to WITHOUT author information, replace with**:
```typescript
                    <BlogPostCardNoAuthor
                      post={post}
                      featured={postIndex === 0 && columnIndex === 0}
                    />
```

**To switch to WITH author information, replace with**:
```typescript
                    <BlogPostCard
                      post={post}
                      featured={postIndex === 0 && columnIndex === 0}
                    />
```

## Quick Reference Table

| Component | With Author | Without Author |
|-----------|-------------|----------------|
| Data Source | `blogPosts` | `blogPostsNoAuthor` |
| Category Function | `getPostsByCategoryId` | `getPostsNoAuthorByCategoryId` |
| Type | `BlogPost` | `BlogPostNoAuthor` |
| Card Component | `BlogPostCard` | `BlogPostCardNoAuthor` |

## Verification Steps

After making the changes:

1. **Check the blog page**: Navigate to `/blog` in your browser
2. **Verify card appearance**: 
   - With author: Should show author avatar and name at the bottom
   - Without author: Should only show date and reading time
3. **Test functionality**: Ensure search, filtering, and pagination still work
4. **Check console**: Make sure there are no TypeScript errors

## Common Issues

### TypeScript Errors
If you see TypeScript errors after switching:
- Make sure ALL instances of the old type/component are replaced
- Check that import statements match the component usage
- Restart your development server if needed

### Missing Author Information
If cards appear broken:
- Verify you're using the correct data source (`blogPosts` vs `blogPostsNoAuthor`)
- Check that the card component matches the data type

### Search Not Working
If search functionality breaks:
- Ensure the `BlogSearch` component props match the data type
- Verify all array type declarations are consistent

## Rollback Instructions

To revert changes, simply follow the same steps but use the opposite configuration. The comment blocks in the code clearly indicate which option is currently active and which is the alternative.

## Need Help?

If you encounter issues:
1. Check that all files have been modified consistently
2. Verify there are no typos in the replaced code
3. Ensure you've saved all files after making changes
4. Restart the development server if problems persist 