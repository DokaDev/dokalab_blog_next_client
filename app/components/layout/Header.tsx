'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Logo from '../common/Logo';
import { useMobileMenu } from '@/lib/contexts/MobileMenuContext';
import styles from './Header.module.scss';

/**
 * Main Site Header Component
 * 
 * Renders the site header with logo, navigation, and mobile menu button.
 * Mobile menu state is managed globally via MobileMenuContext for better
 * separation of concerns and to avoid prop drilling.
 * 
 * Local state management:
 * - mounted: Prevents hydration mismatches by only rendering interactive elements after mount
 * - isTransitioning: Prevents rapid clicking during menu toggle animations
 * 
 * Global state (via context):
 * - isMobileMenuOpen: Shared with Navigation component
 * - toggleMobileMenu: Actions to control menu state
 * 
 * @returns {JSX.Element} Header component
 */
export default function Header() {
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
  
  // Local state for client-side only functionality
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Prevent hydration mismatches - only render interactive elements after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handle mobile menu toggle with animation protection
   * 
   * Prevents rapid clicking during CSS transitions to avoid UI glitches.
   * Uses the global toggleMobileMenu action from context.
   */
  const handleToggleMobileMenu = () => {
    // Prevent multiple clicks during transition
    if (isTransitioning) return;
    
    // Start transition state
    setIsTransitioning(true);
    
    // Toggle menu state using global context
    toggleMobileMenu();
    
    // Reset transition state after animation completes (matches CSS transition duration)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <header className={`${styles.header} ${isMobileMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerLeft}>
          <Logo />
        </div>
        
        <div className={styles.headerRight}>
          {/* Navigation component now gets menu state from context instead of props */}
          <Navigation />
          
          {/* Only render mobile menu button after hydration to prevent SSR/CSR mismatch */}
          {mounted && (
            <button 
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
              onClick={handleToggleMobileMenu}
              aria-label="Toggle menu"
              disabled={isTransitioning}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 