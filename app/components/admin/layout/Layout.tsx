'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 사이드바 토글
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <Header 
        toggleSidebar={toggleSidebar}
      />
      <main className={`${styles.content} ${sidebarCollapsed ? styles.contentExpanded : ''}`}>
        {children}
      </main>
    </div>
  );
} 