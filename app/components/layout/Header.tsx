'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Logo from '../common/Logo';
import styles from './Header.module.scss';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 클라이언트 사이드 상태를 사용하도록 함
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerLeft}>
          <Logo />
        </div>
        
        <div className={styles.headerRight}>
          <Navigation isMobileMenuOpen={isMobileMenuOpen} />
          
          {mounted && (
            <button 
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
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