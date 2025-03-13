import type { Metadata } from "next";
import Header from './components/layout/Header';
import MainWrapper from './components/MainWrapper';
import "./globals.css";

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal tech blog",
};

// Force dynamic rendering for all pages
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {/* Client Component wrapper will handle the className based on path */}
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
} 