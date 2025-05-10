'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isBlogPage = pathname.startsWith('/blog');
  
  return (
    <main className={isHomePage ? 'homePage' : isBlogPage ? 'blogPage' : 'subPage'}>
      {!isBlogPage && !isHomePage && (
        <>
          <h1>Web Development</h1>
          <p>Articles about frontend and backend web development</p>
        </>
      )}
      {children}
    </main>
  );
} 