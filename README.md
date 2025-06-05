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

This blog template provides flexibility with two component variants: one that displays author information and one that doesn't. This guide explains how to switch between these options.

### Available Variants

#### 1. Blog posts with author information (`BlogPostCard`)
- Displays author avatar, name, and bio
- Uses the `BlogPost` type and `blogPosts` dataset
- Suitable for multi-author blogs or when author attribution is important

#### 2. Blog posts without author information (`BlogPostCardNoAuthor`)
- Omits author details, focusing only on content
- Uses the `BlogPostNoAuthor` type and `blogPostsNoAuthor` dataset
- Ideal for single-author blogs or when author details aren't necessary

### How to Switch Between Variants

The codebase contains clearly marked comments to guide you through the component swap process. Look for `COMPONENT SWAP GUIDE` sections throughout the code.

#### Step 1: Import the Correct Components and Types

```typescript
// Option 1: With author information
import { BlogPost } from '@/app/types/blog';
import { blogPosts } from '@/app/data/blogData';
import BlogPostCard from '@/app/components/blog/BlogPostCard';

// Option 2: Without author information
import { BlogPostNoAuthor } from '@/app/types/blog';
import { blogPostsNoAuthor } from '@/app/data/blogData';
import BlogPostCardNoAuthor from '@/app/components/blog/BlogPostCardNoAuthor';
```

#### Step 2: Use the Appropriate Helper Functions

Each variant has its own set of helper functions:

```typescript
// With author information
const categoryPosts = getPostsByCategoryId(categoryId);
const tagPosts = getPostsByTagId(tagId);

// Without author information
const categoryPosts = getPostsByCategoryIdNoAuthor(categoryId);
const tagPosts = getPostsByTagIdNoAuthor(tagId);
```

#### Step 3: Apply the Correct Type Annotations

```typescript
// With author information
const posts: BlogPost[] = blogPosts;

// Without author information
const posts: BlogPostNoAuthor[] = blogPostsNoAuthor;
```

#### Step 4: Render the Appropriate Component

```tsx
{/* With author information */}
<BlogPostCard post={post} featured={featured} />

{/* Without author information */}
<BlogPostCardNoAuthor post={post} featured={featured} />
```

### Sample Implementation

Here's a simplified example showing how to implement a blog list with either variant:

```tsx
'use client';

// Choose ONE of these import sets:
import { BlogPost } from '@/app/types/blog';
import { blogPosts } from '@/app/data/blogData';
import BlogPostCard from '@/app/components/blog/BlogPostCard';

// OR

// import { BlogPostNoAuthor } from '@/app/types/blog';
// import { blogPostsNoAuthor } from '@/app/data/blogData';
// import BlogPostCardNoAuthor from '@/app/components/blog/BlogPostCardNoAuthor';

export default function BlogList() {
  const posts = blogPosts; // OR blogPostsNoAuthor
  
  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <div key={post.id}>
          <BlogPostCard post={post} /> {/* OR <BlogPostCardNoAuthor post={post} /> */}
        </div>
      ))}
    </div>
  );
}
```

This flexible structure allows you to easily choose the presentation style that best fits your blog's needs.

## Environment Variables

Sensitive values such as reCAPTCHA keys are injected during deployment from GitHub Actions secrets. An `.env.example` file shows the required variables:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET=your_secret_key
```

Set `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET` in your repository secrets so the workflow can generate `.env.production` for the Docker build.
