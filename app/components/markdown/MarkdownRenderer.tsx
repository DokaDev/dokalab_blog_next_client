/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import styles from './MarkdownRenderer.module.scss';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // React 마운트 후 인라인 코드 처리를 위한 ref
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  // 마운트 후 인라인 코드 처리
  React.useEffect(() => {
    if (contentRef.current) {
      // 본문 내용 가져오기
      const container = contentRef.current;
      
      // 모든 pre 태그의 code 요소는 코드 블록이므로 건너뜀
      const preElements = container.querySelectorAll('pre');
      preElements.forEach(pre => {
        pre.classList.add('code-block-processed');
      });
      
      // pre 안에 없는 code 요소는 인라인 코드로 처리
      const inlineCodeElements = container.querySelectorAll('code:not(pre.code-block-processed code)');
      inlineCodeElements.forEach(code => {
        if (!code.closest('pre') && 
            !code.classList.contains(styles.inlineCode)) {
          code.classList.add(styles.inlineCode);
        }
      });
    }
  }, [content]);

  return (
    <div className={`${styles.markdownContent} ${className}`} ref={contentRef}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // 코드 컴포넌트 처리
          code({ inline, className, children, ...props }: any) {
            // 코드 블록 처리 (인라인이 아닌 경우만)
            if (!inline) {
              const match = /language-(\w+)/.exec(className || '');
              let language = match ? match[1] : '';
              let fileName = '';
              
              // 콜론(:)을 기준으로 언어와 파일명 분리
              if (language && language.includes(':')) {
                const parts = language.split(':');
                language = parts[0];
                fileName = parts[1];
              } else if (match && className && className.includes(':')) {
                const fullClass = className.split(' ')[0];
                const colonIndex = fullClass.indexOf(':');
                if (colonIndex !== -1) {
                  fileName = fullClass.substring(colonIndex + 1);
                }
              } else if (!match && className && className.includes(':')) {
                const colonIndex = className.indexOf(':');
                if (colonIndex !== -1) {
                  fileName = className.substring(colonIndex + 1);
                }
              }
              
              // 코드 값 추출
              const value = String(children).replace(/\n$/, '');
                  
              // 코드 블록 반환
              return (
                <CodeBlock 
                  language={language || 'text'} 
                  value={value}
                  fileName={fileName}
                />
              );
            }
            
            // 인라인 코드는 ReactMarkdown의 기본 처리를 따름
            // useEffect에서 클래스를 추가할 것임
            return <code {...props}>{children}</code>;
          },
          
          // Other elements customization
          h1: ({ children, ...props }: any) => (
            <h1 className={styles.heading1} {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }: any) => (
            <h2 className={styles.heading2} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }: any) => (
            <h3 className={styles.heading3} {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }: any) => (
            <p className={styles.paragraph} {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }: any) => (
            <ul className={styles.unorderedList} {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }: any) => (
            <ol className={styles.orderedList} {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }: any) => (
            <li className={styles.listItem} {...props}>
              {children}
            </li>
          ),
          a: ({ children, ...props }: any) => (
            <a className={styles.link} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }: any) => (
            <blockquote className={styles.blockquote} {...props}>
              {children}
            </blockquote>
          ),
          img: ({ ...props }: any) => (
            <img className={styles.image} {...props} />
          ),
          table: ({ children, ...props }: any) => (
            <div className={styles.tableWrapper}>
              <table className={styles.table} {...props}>
                {children}
              </table>
            </div>
          ),
          pre: ({ children }: any) => {
            // pre 태그는 그대로 통과시킴
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 