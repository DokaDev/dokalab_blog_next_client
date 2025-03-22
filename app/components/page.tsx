'use client';

import Link from 'next/link';
import styles from './page.module.scss';

// Main page for component testing section
export default function ComponentsPage() {
  return (
    <div className={styles.componentsContainer}>
      <h1 className={styles.title}>Component Testing Area</h1>
      <div className={styles.componentsGrid}>
        <Link href="/components/math-test" className={styles.componentCard}>
          <h2>Math Rendering Test</h2>
          <p>Test the KaTeX rendering capabilities for mathematical expressions</p>
        </Link>
        
        <Link href="/components/markdown-renderer" className={styles.componentCard}>
          <h2>Markdown Renderer</h2>
          <p>Test the custom Markdown renderer with code highlighting</p>
        </Link>
        
        {/* Additional component tests can be added as needed */}
      </div>
    </div>
  );
} 