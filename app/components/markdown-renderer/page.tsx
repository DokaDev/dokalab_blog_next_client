'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

export default function MarkdownRendererTestPage() {
  // 개발 모드 상태 (false면 출력만 표시, true면 입력+출력 표시)
  const [isDevMode, setIsDevMode] = useState(false);

  const [markdownInput, setMarkdownInput] = useState(`# Markdown Renderer Test / 마크다운 렌더러 테스트

This is a test page for the Markdown Renderer component. / 이것은 마크다운 렌더러 컴포넌트의 테스트 페이지입니다.

## Features to implement / 구현할 기능:

1. Basic Markdown syntax / 기본 마크다운 문법
2. Code highlighting / 코드 하이라이팅
3. Custom callouts / 커스텀 콜아웃
4. Math equations / 수학 방정식
5. Diagrams / 다이어그램

## Sample code block / 코드 블록 예시:

\`\`\`javascript
// A sample code block / 샘플 코드 블록
function helloWorld() {
  console.log("Hello, world! / 안녕, 세상!");
}
\`\`\`

\`\`\`typescript
// 타입스크립트 예제
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: '홍길동',
  age: 30
};
\`\`\`

More examples will be added as the component is developed. / 컴포넌트가 개발됨에 따라 더 많은 예제가 추가될 예정입니다.

## Blockquote Example / 인용구 예시

> This is a blockquote. It can be used to indicate a quote or highlight important information.
> 
> It can span multiple lines and contain other *markdown* elements.

> 이것은 인용구입니다. 인용이나 중요한 정보를 강조하는 데 사용할 수 있습니다.
> 
> 여러 줄에 걸쳐 있을 수 있으며 다른 *마크다운* 요소를 포함할 수 있습니다.

## Links and Images / 링크와 이미지

[Visit DokaLab](https://example.com/dokalab) / [DokaLab 방문하기](https://example.com/dokalab)

![Sample Image / 샘플 이미지](https://via.placeholder.com/800x400?text=Sample+Image)

## Tables / 테이블

| Feature / 기능 | Status / 상태 | Priority / 우선순위 |
|----------------|--------------|-------------------|
| Basic Markdown / 기본 마크다운 | ✅ | High / 높음 |
| Code Highlighting / 코드 하이라이팅 | ✅ | High / 높음 |
| Custom Callouts / 커스텀 콜아웃 | 🔜 | Medium / 중간 |
| Math Equations / 수학 방정식 | 🔜 | Medium / 중간 |
| Diagrams / 다이어그램 | 🔜 | Low / 낮음 |

---

**Note / 참고**: This is a placeholder. When the Markdown renderer is fully implemented, additional features will be added. / 이것은 임시 내용입니다. 마크다운 렌더러가 완전히 구현되면 추가 기능이 추가될 예정입니다.`);

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