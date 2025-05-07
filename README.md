# DokaLab Blog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Component Swap Guide

This project provides two versions of blog post cards: one with author information (`BlogPostCard`) and one without (`BlogPostCardNoAuthor`). You can choose which version to use based on your requirements.

### Understanding the Types

#### With Author Information
```typescript
// BlogPost type (includes author data)
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Author;         // Author information included
  categoryId: number;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
}
```

#### Without Author Information
```typescript
// BlogPostNoAuthor type (without author data)
export interface BlogPostNoAuthor {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: number;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
}
```

### Data Sources

The project provides two sets of data and helper functions:

1. **With Author**: Uses `blogPosts` array and standard helper functions
2. **Without Author**: Uses `blogPostsNoAuthor` array and corresponding helper functions

### Swapping Components

#### 1. Import the Appropriate Types and Components

**For components with author information:**
```typescript
import { BlogPost } from '@/app/types/blog';
import { blogPosts, getPostsByCategoryId, getPostsByTagId } from '@/app/data/blogData';
import BlogPostCard from '@/app/components/blog/BlogPostCard';
```

**For components without author information:**
```typescript
import { BlogPostNoAuthor } from '@/app/types/blog';
import { blogPostsNoAuthor, getPostsByCategoryIdNoAuthor, getPostsByTagIdNoAuthor } from '@/app/data/blogData';
import BlogPostCardNoAuthor from '@/app/components/blog/BlogPostCardNoAuthor';
```

#### 2. Update Data Processing Functions

Replace the helper functions based on which version you're using:

**With Author:**
```typescript
const categoryPosts = getPostsByCategoryId(categoryId);
const tagPosts = getPostsByTagId(tagId);
```

**Without Author:**
```typescript
const categoryPosts = getPostsByCategoryIdNoAuthor(categoryId);
const tagPosts = getPostsByTagIdNoAuthor(tagId);
```

#### 3. Update Component Arrays and Typings

When working with arrays or collections:

**With Author:**
```typescript
const columns = Array.from({ length: columnCount }, () => [] as BlogPost[]);
```

**Without Author:**
```typescript
const columns = Array.from({ length: columnCount }, () => [] as BlogPostNoAuthor[]);
```

#### 4. Rendering Components

**With Author:**
```tsx
<BlogPostCard 
  post={post}
  featured={featured}
/>
```

**Without Author:**
```tsx
<BlogPostCardNoAuthor 
  post={post}
  featured={featured}
/>
```

### Example Implementation

Below is an example of a component that displays a list of blog posts:

```tsx
'use client';

import { useState } from 'react';

// Option 1: For components with author information
import { BlogPost } from '@/app/types/blog';
import { blogPosts } from '@/app/data/blogData';
import BlogPostCard from '@/app/components/blog/BlogPostCard';

// Option 2: For components without author information
// import { BlogPostNoAuthor } from '@/app/types/blog';
// import { blogPostsNoAuthor } from '@/app/data/blogData';
// import BlogPostCardNoAuthor from '@/app/components/blog/BlogPostCardNoAuthor';

export default function BlogList() {
  // Choose the appropriate data source
  const posts = blogPosts; // or blogPostsNoAuthor
  
  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <div key={post.id}>
          {/* Option 1: With author information */}
          <BlogPostCard post={post} />
          
          {/* Option 2: Without author information */}
          {/* <BlogPostCardNoAuthor post={post} /> */}
        </div>
      ))}
    </div>
  );
}
```

By following this guide, you can easily switch between displaying blog posts with or without author information throughout your application.
