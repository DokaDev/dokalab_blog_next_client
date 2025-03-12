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
  
  // 컴포넌트가 마운트된 후에만 클라이언트 사이드 상태를 사용하도록 함
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 경로 변경 시에만 메뉴 닫기 - 이전 경로와 현재 경로가 다를 때만 실행
  useEffect(() => {
    if (prevPathRef.current !== pathname && setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    prevPathRef.current = pathname;
  }, [pathname, setIsMobileMenuOpen, isMobileMenuOpen]);
  
  // 모바일 메뉴가 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen]);
  
  // 디버깅용 로그
  useEffect(() => {
    if (mounted) {
      console.log('Navigation 컴포넌트 - 모바일 메뉴 상태:', isMobileMenuOpen);
    }
  }, [isMobileMenuOpen, mounted]);
  
  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  // 클라이언트 사이드 네비게이션 핸들러
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    // 페이지 이동 전에 모바일 메뉴 닫기
    if (setIsMobileMenuOpen && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    router.push(path);
  };
  
  // 모든 초기 렌더링에 대해 동일한 기본 내용 반환
  const navContent = (
    <ul className={styles.navList}>
      {navItems.map((item) => (
        <li key={item.path} className={styles.navItem}>
          {mounted ? (
            <Link 
              href={item.path}
              onClick={(e) => handleNavigation(e, item.path)}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
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