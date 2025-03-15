'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

export default function MarkdownRendererTestPage() {
  // 개발 모드 상태 (false면 출력만 표시, true면 입력+출력 표시)
  const [isDevMode, setIsDevMode] = useState(false);

  const [markdownInput, setMarkdownInput] = useState(`# Markdown Renderer Test

This is a test page for the Markdown Renderer component.

## Features to implement:

1. Basic Markdown syntax
2. Code highlighting
3. Custom callouts
4. Math equations
5. Diagrams

## Sample code block:

\`\`\`javascript
// A sample code block
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

\`\`\`typescript
// TypeScript example
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John Doe',
  age: 30
};
\`\`\`

More examples will be added as the component is developed.

## Blockquote Example

> This is a blockquote. It can be used to indicate a quote or highlight important information.
> 
> It can span multiple lines and contain other *markdown* elements.

## Links and Images

[Visit DokaLab](https://example.com/dokalab)

![Sample Image](https://via.placeholder.com/800x400?text=Sample+Image)

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Basic Markdown | ✅ | High |
| Code Highlighting | ✅ | High |
| Custom Callouts | 🔜 | Medium |
| Math Equations | 🔜 | Medium |
| Diagrams | 🔜 | Low |

---

**Note**: This is a placeholder. When the Markdown renderer is fully implemented, additional features will be added.`);

  return (
    <main className="subPage">
      <div className={styles.container}>
        {/* 개발자 모드 토글 버튼 */}
        <button 
          onClick={() => setIsDevMode(!isDevMode)} 
          className={styles.devModeToggle}
        >
          {isDevMode ? 'View Mode' : 'Edit Mode'}
        </button>

        {isDevMode ? (
          // 개발자 모드 - 에디터 표시
          <div className={styles.editorContainer}>
            <h1 className={styles.title}>Markdown Editor</h1>
            <div className={styles.editorLayout}>
              <div className={styles.inputSection}>
                <textarea
                  id="markdown-input"
                  className={styles.markdownInput}
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  rows={20}
                  spellCheck={false}
                  aria-label="Markdown input editor"
                  placeholder="Enter your markdown here..."
                />
              </div>
              
              <div className={styles.previewSection}>
                <MarkdownRenderer content={markdownInput} />
              </div>
            </div>
          </div>
        ) : (
          // 뷰 모드 - 블로그 본문처럼 보이게
          <article className={styles.articleContent}>
            <div className={styles.articleHeader}>
              <Link href="/components" className={styles.backLink}>
                ← Back to Components
              </Link>
              <h1>Markdown Renderer Test</h1>
              <div className={styles.articleMeta}>
                <p>Sample article to demonstrate markdown rendering</p>
              </div>
            </div>
            
            <div className={styles.articleBody}>
              {/* 마크다운 렌더러를 사용하여 마크다운 콘텐츠 렌더링 */}
              <MarkdownRenderer content={markdownInput} />
            </div>
          </article>
        )}
      </div>
    </main>
  );
} 