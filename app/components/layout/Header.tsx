'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Logo from '../common/Logo';
import styles from './Header.module.scss';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Only use client-side state after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    // Prevent multiple clicks during transition
    if (isTransitioning) return;
    
    // Start transition
    setIsTransitioning(true);
    
    // Toggle menu state
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerLeft}>
          <Logo />
        </div>
        
        <div className={styles.headerRight}>
          <Navigation 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          {mounted && (
            <button 
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
              onClick={toggleMobileMenu}
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