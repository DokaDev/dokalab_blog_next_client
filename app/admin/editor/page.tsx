'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import MarkdownEditor from '@/app/components/admin/markdown/MarkdownEditor';

export default function MarkdownEditorPage() {
  const [markdownContent, setMarkdownContent] = useState('');
  
  // 마크다운 예시 콘텐츠
  const exampleMarkdown = `# Welcome to Markdown Editor

This is a simple example of how the markdown editor works.

## Features

- **Bold text** and *italic text*
- Lists (ordered and unordered)
- [Links](https://example.com)
- Code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

> Blockquotes are also supported

Enjoy writing with markdown!
`;

  // 초기 마크다운 콘텐츠 설정
  useEffect(() => {
    setMarkdownContent(exampleMarkdown);
  }, [exampleMarkdown]);
  
  // 마크다운 콘텐츠 변경 핸들러
  const handleMarkdownChange = (content: string) => {
    setMarkdownContent(content);
  };
  
  return (
    <main className="subPage">
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/admin" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          
          <h1 className={styles.title}>Markdown Editor</h1>
        </div>
        
        <MarkdownEditor 
          initialContent={markdownContent}
          onChange={handleMarkdownChange}
        />
      </div>
    </main>
  );
} 