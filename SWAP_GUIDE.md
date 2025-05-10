# Blog Component Swap Guide

This guide explains how to switch between versions of blog post cards with and without author information.

## Overview

This project provides two ways to display blog post cards:

1. **Version with Author Information**: Blog post cards display the author's name, profile image, and related information.
2. **Version without Author Information**: Blog post cards show only the title, content, tags, and date without author details.

To switch between these versions, you need to modify specific parts of several files in the codebase.

## File Modification Guide

### 1. Blog Page (app/(global)/blog/page.tsx)

The following changes are required in the blog page:

#### 1.1. Change Data Source and Function Imports

```tsx
// Version with author information
import { 
  blogPosts, 
  categoryGroups, 
  getCategoryById, 
  getPostsByCategoryId 
} from '@/app/data/blogData';

// Version without author information
import { 
  blogPostsNoAuthor, 
  categoryGroups, 
  getCategoryById, 
  getPostsNoAuthorByCategoryId 
} from '@/app/data/blogData';
```

#### 1.2. Change Type Import

```tsx
// Version with author information
import { BlogPost } from '@/app/types/blog';

// Version without author information
import { BlogPostNoAuthor } from '@/app/types/blog';
```

#### 1.3. Change Tag-Related Code

```tsx
// Version with author information
const tag = blogPosts.flatMap(post => post.tags).find(tag => tag.id === tagId);

// Version without author information
const tag = blogPostsNoAuthor.flatMap(post => post.tags).find(tag => tag.id === tagId);
```

#### 1.4. Change Filtered Posts Initialisation

```tsx
// Version with author information
let filteredPosts = [...blogPosts];

// Version without author information
let filteredPosts = [...blogPostsNoAuthor];
```

#### 1.5. Change Category-Based Post Filtering

```tsx
// Version with author information
filteredPosts = getPostsByCategoryId(categoryId);

// Version without author information
filteredPosts = getPostsNoAuthorByCategoryId(categoryId);
```

### 2. Blog Search Component (app/components/blog/BlogSearch.tsx)

The following changes are required in the blog search component:

#### 2.1. Change Type and Component Imports

```tsx
// Version with author information
import { BlogPost } from '@/app/types/blog';
import BlogPostCard from './BlogPostCard';

// Version without author information
import { BlogPostNoAuthor } from '@/app/types/blog';
import BlogPostCardNoAuthor from './BlogPostCardNoAuthor';
```

#### 2.2. Change Props Interface

```tsx
// Version with author information
interface BlogSearchProps {
  posts: BlogPost[];
  categoryName?: string;
}

// Version without author information
interface BlogSearchProps {
  posts: BlogPostNoAuthor[];
  categoryName?: string;
}
```

#### 2.3. Change Post Array Type

```tsx
// Version with author information
const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);

// Version without author information
const columns = Array.from({ length: columnCount }, () => [] as BlogPostNoAuthor[]);
```

#### 2.4. Change Post Card Component

```tsx
// Version with author information
<BlogPostCard
  post={post}
  featured={postIndex === 0 && columnIndex === 0}
/>

// Version without author information
<BlogPostCardNoAuthor
  post={post}
  featured={postIndex === 0 && columnIndex === 0}
/>
```

## Complete Swap Procedure Summary

To switch between the version with author information and the version without (or vice versa), follow these steps:

1. In the `app/(global)/blog/page.tsx` file:
   - Change import statements (data sources, functions, types)
   - Change tag and filtering-related code

2. In the `app/components/blog/BlogSearch.tsx` file:
   - Change import statements (types, components)
   - Change Props interface and array types
   - Change post card component usage

By following this guide, you can smoothly transition between the two versions based on whether you want to display author information.

## Important Notes

- The transition between versions must be consistent. Changing only one component whilst leaving others unchanged may cause type errors.
- Different data structures require all related files to be changed together.
- When adding new data or functionality, consider supporting both versions. 