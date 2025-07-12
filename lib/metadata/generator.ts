/**
 * Metadata Generator
 * Centralised metadata generation for SEO optimisation
 * Supports blog posts, category pages, and general pages
 */

import { Metadata } from 'next';
import { config } from '@/config/env';
import { BlogPost, BlogPostNoAuthor, Category, Tag } from '@/app/types/blog';
// Note: Structured data schemas are imported where needed to avoid unused imports

// Base metadata configuration
interface BaseMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

// Blog post metadata options
interface BlogPostMetadataOptions {
  post: BlogPost | BlogPostNoAuthor;
  category?: Category | null;
  showAuthor?: boolean;
}

// Blog listing metadata options
interface BlogListingMetadataOptions {
  categoryId?: number | null;
  tagId?: number | null;
  searchQuery?: string;
  searchType?: string;
  category?: Category | null;
  tag?: Tag | null;
}

/**
 * Generate base metadata structure
 */
export function generateBaseMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    image,
    noIndex = false
  } = options;

  // Let Next.js handle siteName via template in root layout
  const url = `${config.siteUrl}${path}`;
  const ogImage = image || `${config.siteUrl}/images/og-default.jpg`;

  return {
    title,
    description,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    keywords: 'DokaLab, tech blog, programming, development, web development, AI, machine learning, tutorials',
    authors: [{ name: config.siteName }],
    creator: config.siteName,
    publisher: config.siteName,
    formatDetection: {
      telephone: false, // Disable automatic telephone number detection
    },
    openGraph: {
      title,
      description,
      url,
      siteName: config.siteName,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@dokadev',
      creator: '@dokadev',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'theme-color': '#644AC9', // Brand primary color
      'msapplication-TileColor': '#644AC9',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'mobile-web-app-capable': 'yes',
    },
  };
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogPostMetadata(options: BlogPostMetadataOptions): Metadata {
  const { post, category, showAuthor = false } = options;
  
  // Handle type guard for author information
  const hasAuthor = (p: BlogPost | BlogPostNoAuthor): p is BlogPost => 'author' in p;
  
  // Let Next.js handle siteName via template in root layout
  const title = post.title;
  const description = post.excerpt || 'Read this insightful article on our tech blog.';
  const url = `${config.siteUrl}/blog/post/${post.id}`;
  const publishedTime = new Date(post.publishedAt).toISOString();
  
  // Build keywords array
  const keywords = [
    ...post.tags.map(tag => tag.name),
    category?.name || '',
    config.siteName,
    'Tech Blog',
    'Programming',
    'Development',
    'Technology'
  ].filter(Boolean);

  // Determine authors
  const authors = showAuthor && hasAuthor(post) 
    ? [post.author.name] 
    : [config.siteName];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: authors.map(name => ({ name })),
    creator: showAuthor && hasAuthor(post) ? post.author.name : config.siteName,
    publisher: config.siteName,
    category: category?.name,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      siteName: config.siteName,
      locale: 'en_US',
      publishedTime,
      modifiedTime: publishedTime, // Update when backend provides updatedAt
      authors,
      tags: post.tags.map(tag => tag.name),
      section: category?.name,
      images: post.coverImage 
        ? [{ 
            url: post.coverImage, 
            alt: post.title,
            width: 1200,
            height: 630,
            type: 'image/jpeg',
          }] 
        : [{
            url: `${config.siteUrl}/og-image.png`,
            alt: config.siteName,
            width: 1200,
            height: 630,
            type: 'image/png',
          }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@dokadev',
      creator: '@dokadev', // Default to site creator
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : [`${config.siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'article:reading_time': `${post.readingTime} minutes`,
      'article:published_time': publishedTime,
      'article:section': category?.name || '',
      'article:tag': post.tags.map(tag => tag.name).join(', '),
      'theme-color': '#644AC9',
      'msapplication-TileColor': '#644AC9',
    },
  };
}

/**
 * Generate metadata for blog listing pages
 */
export function generateBlogListingMetadata(options: BlogListingMetadataOptions = {}): Metadata {
  const {
    categoryId,
    tagId,
    searchQuery,
    searchType,
    category,
    tag
  } = options;

  // Build dynamic title based on filters (without siteName to avoid duplication)
  let title = 'Blog';
  let description = 'Explore our latest articles, tutorials, and insights on technology, programming, and development.';
  
  // Category-specific metadata
  if (categoryId && category) {
    title = `${category.name}`;
    description = `Discover articles about ${category.name.toLowerCase()}. ${description}`;
  }

  // Tag-specific metadata
  if (tagId && tag) {
    title = categoryId && category 
      ? `${category.name} - Tagged with '${tag.name}'`
      : `Tagged with '${tag.name}'`;
    description = `Articles tagged with ${tag.name}. ${description}`;
  }
  
  // Search-specific metadata
  if (searchQuery) {
    title = `Search: ${searchQuery}${title !== 'Blog' ? ` - ${title}` : ''}`;
    description = `Search results for "${searchQuery}". ${description}`;
  }

  const path = buildBlogListingPath({ categoryId, tagId, searchQuery, searchType });
  
  return generateBaseMetadata({
    title,
    description,
    path,
  });
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata(
  title: string,
  description: string,
  path: string,
  options: Partial<BaseMetadataOptions> = {}
): Metadata {
  return generateBaseMetadata({
    title,
    description,
    path,
    ...options,
  });
}

/**
 * Generate metadata for error pages
 */
export function generateErrorPageMetadata(errorCode: number): Metadata {
  const errorMessages = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found. Please check the URL or return to the homepage.',
    },
    500: {
      title: 'Server Error',
      description: 'We encountered an unexpected error. Please try again later or contact support if the problem persists.',
    },
  };

  const error = errorMessages[errorCode as keyof typeof errorMessages] || errorMessages[500];
  
  return generateBaseMetadata({
    title: error.title,
    description: error.description,
    noIndex: true,
  });
}

/**
 * Build URL path for blog listing pages
 */
function buildBlogListingPath(options: BlogListingMetadataOptions): string {
  const { categoryId, tagId, searchQuery, searchType } = options;
  
  const path = '/blog';
  const params = new URLSearchParams();
  
  if (categoryId) params.set('category', categoryId.toString());
  if (tagId) params.set('tag', tagId.toString());
  if (searchQuery) {
    params.set('q', searchQuery);
    if (searchType && searchType !== 'both') {
      params.set('searchType', searchType);
    }
  }
  
  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Utility to generate JSON-LD structured data for blog posts
 */
export function generateBlogPostStructuredData(
  post: BlogPost | BlogPostNoAuthor,
  category?: Category | null
): Record<string, unknown> {
  const hasAuthor = (p: BlogPost | BlogPostNoAuthor): p is BlogPost => 'author' in p;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || `${config.siteUrl}/images/og-default.jpg`,
    author: hasAuthor(post) 
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : {
          '@type': 'Organization',
          name: config.siteName,
        },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl,
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.siteUrl}/blog/post/${post.id}`,
    },
    keywords: post.tags.map(tag => tag.name).join(', '),
    articleSection: category?.name || '',
    timeRequired: `PT${post.readingTime}M`,
  };
} 