import type { Metadata } from "next";
import Header from '../components/layout/Header';
import MainWrapper from '../components/MainWrapper';
import { MobileMenuProvider } from '@/lib/contexts/MobileMenuContext';
import { config } from '@/config/env';
import { getFontVariables } from '@/lib/fonts';
import StructuredData, { 
  generateOrganizationSchema, 
  generateWebsiteSchema 
} from '../components/seo/StructuredData';
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: config.siteName,
    template: `%s | ${config.siteName}`
  },
  description: config.siteDescription,
  metadataBase: new URL(config.siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    siteName: config.siteName,
    images: [
      {
        url: `${config.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: config.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dokadev',
    creator: '@dokadev',
  },
};

// Remove global force-dynamic setting
// Each page should decide its own rendering strategy
// Static pages (blog posts) should use SSG, dynamic pages can use SSR

/**
 * Root Layout for Global Pages
 * 
 * Provides the foundational structure for all pages outside of admin section.
 * Includes global mobile menu state management via MobileMenuProvider.
 * 
 * Architecture:
 * - MobileMenuProvider: Enables global mobile menu state sharing between Header and Navigation
 * - Header: Fixed navigation header with mobile menu button
 * - MainWrapper: Client component that applies CSS classes based on current route
 * 
 * @param {Object} props - Layout props
 * @param {React.ReactNode} props.children - Page content to render
 * @returns {JSX.Element} Root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate base structured data for all pages
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  
  return (
    <html lang="en" className={getFontVariables()} suppressHydrationWarning>
      <head>
        {/* Global structured data for SEO */}
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body suppressHydrationWarning>
        {/* 
          MobileMenuProvider wraps Header and MainWrapper to enable
          global mobile menu state sharing without prop drilling 
        */}
        <MobileMenuProvider>
          <Header />
          {/* Client Component wrapper will handle the className based on path */}
          <MainWrapper>{children}</MainWrapper>
        </MobileMenuProvider>
      </body>
    </html>
  );
} 