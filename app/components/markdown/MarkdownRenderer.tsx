'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import styles from './MarkdownRenderer.module.scss';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper function for preprocessing LaTeX expressions
const preprocessLatex = (content: string): string => {
  // Fix inline math expressions: $...$
  let processed = content.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    // Process superscripts: x^2 -> x^{2}
    const processedFormula = formula
      .replace(/\^(\w)(?!\{)/g, '^{$1}')
      .replace(/\^([^{\s]+)(?!\{)/g, '^{$1}')
      
      // Process subscripts: x_2 -> x_{2}
      .replace(/_(\w)(?!\{)/g, '_{$1}')
      .replace(/_([^{\s]+)(?!\{)/g, '_{$1}');
    
    return `$${processedFormula}$`;
  });
  
  // Fix block math expressions: $$...$$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    // Process superscripts: x^2 -> x^{2}
    const processedFormula = formula
      .replace(/\^(\w)(?!\{)/g, '^{$1}')
      .replace(/\^([^{\s]+)(?!\{)/g, '^{$1}')
      
      // Process subscripts: x_2 -> x_{2}
      .replace(/_(\w)(?!\{)/g, '_{$1}')
      .replace(/_([^{\s]+)(?!\{)/g, '_{$1}');
    
    return `$$${processedFormula}$$`;
  });
  
  return processed;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Pre-process LaTeX expressions
  const processedContent = preprocessLatex(content);

  // This effect ensures KaTeX styles are properly applied
  useEffect(() => {
    // Force a repaint to ensure KaTeX styling is applied
    document.querySelectorAll('.katex, .katex-display').forEach(el => {
      // Add a class temporarily and remove it to force a style recalculation
      el.classList.add('katex-repaint');
      setTimeout(() => el.classList.remove('katex-repaint'), 0);
    });
  }, [processedContent]);
  
  return (
    <div className={`${styles.markdownContent} ${className} markdown-body`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex
        ]}
        components={{
          // All other components remain the same
          code: (props: any) => {
            const { inline, className, children, node, ...rest } = props;
            
            // Determine if code is inline by checking if it's a simple string and exists on a single line
            const isInline = inline || 
              (typeof children === 'string' && 
              node?.position?.start?.line === node?.position?.end?.line);
            
            if (isInline) {
              // Inline code (wrapped in single backticks)
              return (
                <code className={styles.inlineCode} {...rest}>
                  {typeof children === 'string' ? children : String(children).replace(/\n$/, '')}
                </code>
              );
            }
            
            // Code block handling (wrapped in triple backticks)
            // Preserve original className (e.g., language-javascript{1,3-5}:file.js)
            const originalClassName = className || '';
            const match = /language-(\w+)/.exec(originalClassName);
            let language = match ? match[1] : '';
            let fileName = '';
            const highlightLines: number[] = [];
            
            // Extract highlight line specifications from curly braces {}
            const highlightMatch = originalClassName.match(/\{([^}]+)\}/);
            if (highlightMatch && highlightMatch[1]) {
              const highlightStr = highlightMatch[1];
              
              // Parse highlight line numbers
              const highlights = highlightStr.split(',');
              highlights.forEach((h: string) => {
                if (h.includes('-')) {
                  // Handle range format (e.g., 3-5)
                  const [start, end] = h.split('-').map(Number);
                  if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                      highlightLines.push(i);
                    }
                  }
                } else {
                  // Handle single line format (e.g., 1)
                  const lineNum = Number(h);
                  if (!isNaN(lineNum)) {
                    highlightLines.push(lineNum);
                  }
                }
              });
            }
            
            // Remove curly braces to get clean language identifier
            if (language && highlightMatch) {
              language = language.replace(/\{[^}]+\}/, '');
            }
            
            // Extract filename from colon notation
            const colonMatch = originalClassName.match(/:([^:\s]+)/);
            if (colonMatch && colonMatch[1]) {
              fileName = colonMatch[1];
              
              // Remove filename from language part if it's included
              if (language.includes(':')) {
                language = language.split(':')[0];
              }
            }
            
            // Safely extract code value regardless of format
            const value = typeof children === 'string' 
              ? children 
              : Array.isArray(children) 
                ? children.join('') 
                : String(children);
                
            // Return final code block component
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
            // Check if this paragraph contains a checkbox item
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
            // Check if list contains checkbox/task items
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
            // Check if this is a checkbox/task list item
            const isTaskListItem = 
              node?.children?.[0]?.type === 'paragraph' && 
              node?.children?.[0]?.children?.[0]?.type === 'text' &&
              (node?.children?.[0]?.children?.[0]?.value.startsWith('[ ] ') || 
               node?.children?.[0]?.children?.[0]?.value.startsWith('[x] '));
            
            if (isTaskListItem) {
              // Apply custom styles for checkbox items
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
            
            // Regular list item
            return (
              <li className={styles.listItem} {...props}>
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
          img: ({ src, ...props }: any) => (
            <img className={styles.image} src={src} alt={props.alt || "Markdown image"} {...props} />
          ),
          table: ({ children, ...props }: any) => (
            <div className={styles.tableWrapper}>
              <table className={styles.table} {...props}>
                {children}
              </table>
            </div>
          ),
          pre: ({ children }: any) => {
            // pre tags typically wrap code blocks
            // We're already handling this with CodeBlock component, so we simply pass children through
            return <>{children}</>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 