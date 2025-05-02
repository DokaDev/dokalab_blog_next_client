'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <Header />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
} 