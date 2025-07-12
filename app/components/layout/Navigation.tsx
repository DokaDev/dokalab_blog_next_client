'use client';

import Link from 'next/link';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { useMobileMenu } from '@/lib/contexts/MobileMenuContext';
import styles from './Navigation.module.scss';

/**
 * Main Site Navigation Component
 * 
 * Renders the primary navigation menu for the site. Uses global mobile menu context
 * instead of props to improve component independence and reduce coupling with Header.
 * 
 * State management:
 * - Mobile menu state: Retrieved from MobileMenuContext (global)
 * - Navigation logic: Handled by useNavigation hook (routing, active states, scroll lock)
 * 
 * Hydration strategy:
 * - Shows static content first to prevent hydration mismatches
 * - Progressively enhances with interactive links after mount
 * 
 * @returns {JSX.Element} Navigation component
 */
export default function Navigation() {
  // Get mobile menu state from global context instead of props
  const { isMobileMenuOpen } = useMobileMenu();
  
  // Custom hook handles navigation logic, routing, and mobile menu interactions
  const { mounted, navRef, handleNavigation, isActive } = useNavigation();
  
  // Navigation menu items configuration
  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' }
    // Contact temporarily disabled - uncomment when ready
    // { label: 'Contact', path: '/contact' }
  ];
  
  // Generate navigation content with hydration-safe rendering
  const navContent = (
    <ul className={styles.navList}>
      {navItems.map((item) => (
        <li key={item.path} className={styles.navItem}>
          {mounted ? (
            // Interactive link - only after hydration
            <Link 
              href={item.path}
              onClick={(e) => handleNavigation(e, item.path)}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ) : (
            // Static content during SSR/initial render to prevent hydration mismatch
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