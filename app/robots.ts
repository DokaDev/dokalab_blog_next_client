/**
 * Dynamic Robots.txt Generator
 * Optimized for search engine crawling and SEO
 * 
 * Features:
 * - Environment-aware configuration
 * - Blog-friendly crawling rules
 * - Sitemap reference
 * - Admin section protection
 */

import { MetadataRoute } from 'next';
import { config } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/blog/',
          '/blog/post/',
          '/about',
          '/contact',
          '/components',
          '/components/',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '*.json',
          '*.map',
          '/components/markdown-renderer', // Test page not for indexing
        ],
        crawlDelay: 1, // Be respectful to servers
      },
      // Specific rules for major search engines
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog',
          '/blog/',
          '/blog/post/',
          '/about',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/blog',
          '/blog/',
          '/blog/post/',
          '/about',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/api/',
          '/_next/',
        ],
        crawlDelay: 2, // Bing prefers slightly slower crawling
      },
      // Block admin area completely for all bots
      {
        userAgent: '*',
        disallow: ['/admin'],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
    host: config.siteUrl,
  };
} 