'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Logo from '../common/Logo';
import styles from './Header.module.scss';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 컴포넌트가 마운트된 후에만 클라이언트 사이드 상태를 사용하도록 함
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 모바일 메뉴 상태 변경 시 디버깅 로그
  useEffect(() => {
    if (mounted) {
      console.log('Navigation mobileOpen 클래스 적용 상태:', isMobileMenuOpen);
    }
  }, [isMobileMenuOpen, mounted]);

  const toggleMobileMenu = () => {
    if (isTransitioning) return;
    
    console.log('메뉴 토글 전 상태:', isMobileMenuOpen);
    
    setIsTransitioning(true);
    
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    setTimeout(() => {
      setIsTransitioning(false);
      console.log('메뉴 토글 후 상태:', !isMobileMenuOpen);
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