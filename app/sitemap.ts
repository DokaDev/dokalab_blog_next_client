/**
 * Dynamic Sitemap Generator
 * Comprehensive sitemap for optimal search engine indexing
 * 
 * Features:
 * - Dynamic blog post inclusion
 * - Category-based URLs
 * - Priority and frequency optimization
 * - Last modified timestamps
 * - Multi-language support ready
 */

import { MetadataRoute } from 'next';
import { config } from '@/config/env';
import { blogPostsNoAuthor, categoryGroups } from '@/app/data/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.siteUrl;
  const currentDate = new Date();
  
  // Static pages with their priorities and update frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0, // Homepage highest priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8, // Important static page
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7, // Contact page
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9, // Blog main page - high priority
    },
  ];
  
  // Generate blog post URLs dynamically
  const blogPostPages: MetadataRoute.Sitemap = blogPostsNoAuthor.map((post) => ({
    url: `${baseUrl}/blog/post/${post.id}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8, // Blog posts are important content
  }));
  
  // Generate category pages dynamically
  const categoryPages: MetadataRoute.Sitemap = [];
  categoryGroups.forEach((group) => {
    group.categories.forEach((category) => {
      categoryPages.push({
        url: `${baseUrl}/blog?category=${category.id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7, // Category pages
      });
    });
  });
  
  // Generate tag-based pages (from unique tags across all posts)
  const allTags = Array.from(
    new Set(
      blogPostsNoAuthor.flatMap(post => post.tags.map(tag => tag.id))
    )
  );
  
  const tagPages: MetadataRoute.Sitemap = allTags.map((tagId) => ({
    url: `${baseUrl}/blog?tag=${tagId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6, // Tag pages lower priority
  }));
  
  // Combine all pages
  const allPages = [
    ...staticPages,
    ...blogPostPages,
    ...categoryPages,
    ...tagPages,
  ];
  
  // Sort by priority (highest first) for better indexing
  return allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0));
} 