'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navigation.module.scss';

interface NavigationProps {
  isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // 컴포넌트가 마운트된 후에만 클라이언트 사이드 상태를 사용하도록 함
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  // 클라이언트 사이드 네비게이션 핸들러
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
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
    <nav className={`${styles.navigation} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
      {navContent}
    </nav>
  );
} 