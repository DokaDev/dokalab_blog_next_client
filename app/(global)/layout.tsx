import type { Metadata } from "next";
import Header from '../components/layout/Header';
import MainWrapper from '../components/MainWrapper';
import { config } from '@/config/env';
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        {/* Client Component wrapper will handle the className based on path */}
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
} 