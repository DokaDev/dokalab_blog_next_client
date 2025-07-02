'use client';

import Link from 'next/link';
import { useNavigation } from '@/lib/hooks/useNavigation';
import styles from './Navigation.module.scss';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
  const { mounted, navRef, handleNavigation, isActive } = useNavigation({
    isMobileMenuOpen,
    setIsMobileMenuOpen
  });
  
  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' }
    // ,
    // { label: 'Contact', path: '/contact' }
  ];
  
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