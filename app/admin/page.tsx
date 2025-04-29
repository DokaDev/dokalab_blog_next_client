'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

interface AdminMenuItem {
  title: string;
  description: string;
  path: string;
}

export default function AdminPage() {
  const router = useRouter();
  
  // 관리자 메뉴 항목 목록
  const adminMenuItems: AdminMenuItem[] = [
    {
      title: 'Markdown Editor',
      description: 'Create and edit blog posts with markdown',
      path: '/admin/editor'
    },
    // 추후 다른 관리자 메뉴 추가 예정
  ];

  return (
    <main className="subPage">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.description}>
            Manage your blog content and settings from this dashboard.
          </p>
        </div>
        
        <nav className={styles.adminNav}>
          <Link href="/admin" className={`${styles.navItem} ${styles.active}`}>
            Dashboard
          </Link>
          {/* 추후 다른 관리자 메뉴 링크 추가 예정 */}
        </nav>
        
        <div className={styles.content}>
          <div className={styles.adminGrid}>
            {adminMenuItems.map((item, index) => (
              <div 
                key={index}
                className={styles.adminCard}
                onClick={() => router.push(item.path)}
              >
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 