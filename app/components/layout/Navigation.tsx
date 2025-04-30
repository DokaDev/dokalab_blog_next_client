'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navigation.module.scss';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const prevPathRef = useRef(pathname);
  const navRef = useRef<HTMLElement>(null);
  
  // Only use client-side state after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Close menu only when path changes - compare current and previous paths
  useEffect(() => {
    if (prevPathRef.current !== pathname && setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    prevPathRef.current = pathname;
  }, [pathname, setIsMobileMenuOpen, isMobileMenuOpen]);
  
  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    // Restore scroll on component unmount
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen]);
  
  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
    { label: 'Components', path: '/components' },
    { label: 'Admin', path: '/admin' }
  ];

  // Client-side navigation handler
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // Close mobile menu before page navigation
    if (setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    router.push(path);
  };
  
  // Helper function to determine if a nav item should be active
  const isActive = (path: string) => {
    // 루트 경로('/')는 정확히 일치하는 경우에만 active
    if (path === '/') {
      return pathname === '/';
    }
    
    // 다른 메뉴 항목들은 경로의 시작 부분이 일치하는지 확인
    // 예: '/components'로 시작하는 모든 경로에서 Components 메뉴가 active
    return pathname.startsWith(path);
  };
  
  // Return same base content for all initial renders
  const navContent = (
    <ul className={styles.navList}>
      {navItems.map((item) => (
        <li key={item.path} className={styles.navItem}>
          {mounted ? (
            <Link 
              href={item.path}
              onClick={(e) => handleNavigation(e, item.path)}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={styles.navLink}>
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav 
      ref={navRef}
      className={`${styles.navigation} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
    >
      {navContent}
    </nav>
  );
} 