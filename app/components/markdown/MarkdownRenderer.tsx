'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import 'katex/dist/katex.min.css';
import styles from './MarkdownRenderer.module.scss';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Create a custom sanitization schema that allows KaTeX elements
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Add KaTeX-specific attributes and elements
    span: [
      ...(defaultSchema.attributes?.span || []),
      ['className', 'katex', 'katex-mathml', 'katex-html', 'math-inline'],
      ['style'],
    ],
    div: [
      ...(defaultSchema.attributes?.div || []),
      ['className', 'katex', 'katex-display', 'math-display'],
      ['style'],
    ],
    svg: [
      ...(defaultSchema.attributes?.svg || []),
      ['style', 'width', 'height', 'viewBox', 'preserveAspectRatio', 'overflow'],
    ],
    // Allow all attributes on annotation elements
    annotation: [['*']],
    semantics: [['*']],
    mrow: [['*']],
    mo: [['*']],
    mstyle: [['*']],
    mspace: [['*']],
    msub: [['*']],
    msup: [['*']],
    msubsup: [['*']],
    mi: [['*']],
    mn: [['*']],
    mtext: [['*']],
    mfrac: [['*']],
    mroot: [['*']],
    msqrt: [['*']],
  },
  // Add KaTeX-specific tags to the allowed list
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'annotation', 'semantics', 'math', 'mrow', 'mo', 'mstyle', 'mspace',
    'msub', 'msup', 'msubsup', 'mi', 'mn', 'mtext', 'mfrac', 'mroot', 'msqrt',
  ],
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`${styles.markdownContent} ${className} markdown-body`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          code: (props: any) => {
            const { inline, className, children, node, ...rest } = props;
            
            // children이 단순 문자열이고 node.position이 있으며 한 줄이라면 인라인 코드로 판단
            const isInline = inline || 
              (typeof children === 'string' && 
              node?.position?.start?.line === node?.position?.end?.line);
            
            if (isInline) {
              // 인라인 코드 (백틱 하나로 감싸진 코드)
              return (
                <code className={styles.inlineCode} {...rest}>
                  {typeof children === 'string' ? children : String(children).replace(/\n$/, '')}
                </code>
              );
            }
            
            // 여기서부터는 코드 블록(백틱 세 개로 감싸진 코드)
            // 원본 className 보존 (예: language-javascript{1,3-5}:file.js)
            const originalClassName = className || '';
            const match = /language-(\w+)/.exec(originalClassName);
            let language = match ? match[1] : '';
            let fileName = '';
            const highlightLines: number[] = [];
            
            // 하이라이트 부분 { } 추출
            const highlightMatch = originalClassName.match(/\{([^}]+)\}/);
            if (highlightMatch && highlightMatch[1]) {
              const highlightStr = highlightMatch[1];
              
              // 하이라이트 라인 번호 파싱
              const highlights = highlightStr.split(',');
              highlights.forEach((h: string) => {
                if (h.includes('-')) {
                  // 범위 처리 (예: 3-5)
                  const [start, end] = h.split('-').map(Number);
                  if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                      highlightLines.push(i);
                    }
                  }
                } else {
                  // 단일 라인 처리 (예: 1)
                  const lineNum = Number(h);
                  if (!isNaN(lineNum)) {
                    highlightLines.push(lineNum);
                  }
                }
              });
            }
            
            // 중괄호 부분 제거하여 깨끗한 language 얻기
            if (language && highlightMatch) {
              language = language.replace(/\{[^}]+\}/, '');
            }
            
            // 콜론(:) 부분 처리하여 파일명 추출
            const colonMatch = originalClassName.match(/:([^:\s]+)/);
            if (colonMatch && colonMatch[1]) {
              fileName = colonMatch[1];
              
              // 파일명이 language 부분에도 들어갔다면 제거
              if (language.includes(':')) {
                language = language.split(':')[0];
              }
            }
            
            // 코드 값을 안전하게 추출
            const value = typeof children === 'string' 
              ? children 
              : Array.isArray(children) 
                ? children.join('') 
                : String(children);
                
            // 최종 코드 블록 반환
            return (
              <CodeBlock 
                language={language} 
                value={value.replace(/\n$/, '')}
                fileName={fileName}
                highlightLines={highlightLines}
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
          p: ({ children, node, ...props }: any) => {
            // 체크박스를 포함한 paragraph인지 확인
            const isTaskItem = 
              node?.children?.[0]?.type === 'text' &&
              (node?.children?.[0]?.value.startsWith('[ ] ') || 
               node?.children?.[0]?.value.startsWith('[x] '));
            
            if (isTaskItem) {
              const isChecked = node?.children?.[0]?.value.startsWith('[x] ');
              const textContent = node?.children?.[0]?.value.replace(/^\[(x|)\] /, '');
              
              return (
                <p 
                  className={styles.taskItemParagraph}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    margin: 0,
                    paddingLeft: 0
                  }}
                  {...props}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    aria-label={isChecked ? 'Completed' : 'Incomplete'}
                  />
                  <span style={{ flex: 1 }}>{textContent}</span>
                  {node?.children?.slice(1).map((child: any, i: number) => (
                    <React.Fragment key={i}>
                      {child.value || children[i+1]}
                    </React.Fragment>
                  ))}
                </p>
              );
            }
            
            return (
              <p className={styles.paragraph} {...props}>
                {children}
              </p>
            );
          },
          ul: ({ children, node, ...props }: any) => {
            // 체크박스가 포함된 리스트인지 확인
            const hasTaskItems = node?.children?.some((child: any) => 
              child?.children?.[0]?.type === 'paragraph' && 
              child?.children?.[0]?.children?.[0]?.type === 'text' &&
              (child?.children?.[0]?.children?.[0]?.value.startsWith('[ ] ') || 
               child?.children?.[0]?.children?.[0]?.value.startsWith('[x] '))
            );
            
            if (hasTaskItems) {
              return (
                <ul 
                  className={`${styles.unorderedList} ${styles.taskList}`} 
                  {...props}
                  style={{
                    listStyleType: 'none',
                    paddingLeft: '0',
                    margin: 0,
                  }}
                >
                  {children}
                </ul>
              );
            }
            
            return (
              <ul className={styles.unorderedList} {...props}>
                {children}
              </ul>
            );
          },
          ol: ({ children, ...props }: any) => (
            <ol className={styles.orderedList} {...props}>
              {children}
            </ol>
          ),
          li: ({ children, node, ...props }: any) => {
            // 체크박스 리스트 아이템인지 확인
            const isTaskListItem = 
              node?.children?.[0]?.type === 'paragraph' && 
              node?.children?.[0]?.children?.[0]?.type === 'text' &&
              (node?.children?.[0]?.children?.[0]?.value.startsWith('[ ] ') || 
               node?.children?.[0]?.children?.[0]?.value.startsWith('[x] '));
            
            if (isTaskListItem) {
              // 체크박스 아이템일 경우 custom 스타일 적용
              return (
                <li 
                  className={`${styles.listItem} ${styles.taskListItem}`} 
                  {...props} 
                  style={{ 
                    listStyleType: 'none', 
                    listStyle: 'none',
                    paddingLeft: 0,
                    marginLeft: 0,
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}
                >
                  {children}
                </li>
              );
            }
            
            // 일반 리스트 아이템
            return (
              <li className={styles.listItem} {...props} style={{ 
                padding: 0, 
                margin: 0,
                listStyleType: 'disc',
                listStylePosition: 'inside'
              }}>
                {children}
              </li>
            );
          },
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
            // pre 태그는 일반적으로 코드 블록을 감싸는 용도로 사용됨
            // 여기서는 우리가 이미 CodeBlock으로 처리하므로 간단히 패스
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