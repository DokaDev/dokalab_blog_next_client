/**
 * StructuredData Component
 * Injects JSON-LD structured data into the page head for SEO optimization
 * 
 * Features:
 * - Type-safe structured data injection
 * - Multiple schema type support
 * - Automatic JSON-LD formatting
 * - SEO-optimized schema.org compliance
 */

import { BlogPost, BlogPostNoAuthor, Category } from '@/app/types/blog';
import { config } from '@/config/env';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    url?: string;
  };
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'Website';
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': 'Organization';
    name: string;
  };
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface BlogPostingSchema {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords: string;
  articleSection: string;
  timeRequired: string;
}

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  url?: string;
  sameAs?: string[];
}

type StructuredDataSchema = 
  | OrganizationSchema 
  | WebsiteSchema 
  | BreadcrumbListSchema 
  | BlogPostingSchema 
  | PersonSchema;

// =============================================================================
// SCHEMA GENERATORS
// =============================================================================

/**
 * Generate Organization schema for the site
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: `${config.siteUrl}/logo.png`,
    sameAs: [
      // Add social media URLs when available
      // 'https://twitter.com/dokadev',
      // 'https://github.com/dokadev',
      // 'https://linkedin.com/in/dokadev'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: `${config.siteUrl}/contact`,
    },
  };
}

/**
 * Generate Website schema for the site
 */
export function generateWebsiteSchema(): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: config.siteName,
    url: config.siteUrl,
    description: config.siteDescription,
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string;
  url?: string;
}>): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

/**
 * Generate BlogPosting schema for blog posts
 */
export function generateBlogPostSchema(
  post: BlogPost | BlogPostNoAuthor,
  category?: Category | null
): BlogPostingSchema {
  const hasAuthor = (p: BlogPost | BlogPostNoAuthor): p is BlogPost => 'author' in p;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || 'Read this insightful article on our tech blog.',
    image: post.coverImage || `${config.siteUrl}/og-image.png`,
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

/**
 * Generate Person schema for author information
 */
export function generatePersonSchema(author: {
  name: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}): PersonSchema {
  const sameAs = [];
  if (author.social?.twitter) sameAs.push(`https://twitter.com/${author.social.twitter}`);
  if (author.social?.github) sameAs.push(`https://github.com/${author.social.github}`);
  if (author.social?.linkedin) sameAs.push(`https://linkedin.com/in/${author.social.linkedin}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: 'Developer',
    worksFor: {
      '@type': 'Organization',
      name: config.siteName,
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

interface StructuredDataProps {
  data: StructuredDataSchema | StructuredDataSchema[];
}

/**
 * StructuredData Component
 * Injects JSON-LD structured data into the page head
 * 
 * @param data - Single schema object or array of schema objects
 */
export default function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0), // Minified JSON for production
          }}
        />
      ))}
    </>
  );
} 