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
  return (
    <div className={`${styles.markdownContent} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Code block customization
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            let language = match ? match[1] : '';
            let fileName = '';
            
            // 콜론(:)을 기준으로 언어와 파일명 분리
            if (language && language.includes(':')) {
              const parts = language.split(':');
              language = parts[0];
              fileName = parts[1];
            } else if (match && className && className.includes(':')) {
              // 언어가 지정되어 있지만 콜론 뒤에 파일명이 있는 경우 (language-js:filename.js)
              const fullClass = className.split(' ')[0]; // language-js:filename.js
              const colonIndex = fullClass.indexOf(':');
              if (colonIndex !== -1) {
                fileName = fullClass.substring(colonIndex + 1);
              }
            } else if (!match && className && className.includes(':')) {
              // 언어가 없고 파일명만 있는 경우 (`:filename.js`)
              const colonIndex = className.indexOf(':');
              if (colonIndex !== -1) {
                fileName = className.substring(colonIndex + 1);
              }
            }
            
            // 인라인 코드는 일반 코드 요소로 렌더링 (백틱 하나로 감싸진 코드)
            if (inline) {
              return (
                <code className={styles.inlineCode} {...props}>
                  {children}
                </code>
              );
            }
            
            // 코드 블록은 CodeBlock 컴포넌트로 렌더링 (백틱 세 개로 감싸진 코드)
            return (
              <CodeBlock 
                language={language} 
                value={String(children).replace(/\n$/, '')}
                fileName={fileName}
              />
            );
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
          pre: ({ children, ...props }: any) => (
            <pre className={styles.codeBlock} {...props}>
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 