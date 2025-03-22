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
    { label: 'Components', path: '/components' }
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
    // Root path ('/') only matches exact path
    if (path === '/') {
      return pathname === '/';
    }
    
    // Other menu items are active when the path starts with the target path
    // For example: '/components' will be active for any path starting with '/components'
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