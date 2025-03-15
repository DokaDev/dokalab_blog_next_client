'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

// Component Test 페이지 메인
export default function ComponentsPage() {
  const router = useRouter();

  const testComponents = [
    {
      title: 'Markdown Renderer',
      description: 'Test page for the Markdown Renderer component',
      path: '/components/markdown-renderer'
    }
    // 필요에 따라 더 많은 컴포넌트 테스트 추가 가능
  ];

  return (
    <main className="subPage">
      <div className={styles.container}>
        <h1 className={styles.title}>Component Testing</h1>
        <p className={styles.description}>
          This page is for testing and demonstrating various components.
          It will be removed in the production release.
        </p>

        <div className={styles.componentsGrid}>
          {testComponents.map((component, index) => (
            <div 
              key={index}
              className={styles.componentCard}
              onClick={() => router.push(component.path)}
            >
              <h2>{component.title}</h2>
              <p>{component.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 