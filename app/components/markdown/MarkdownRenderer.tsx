'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
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

/**
 * Process alert box syntax (:::type content:::) and convert it to HTML
 * Supports 4 alert types: tip, info, warning, and danger
 * @param content - The markdown content to process
 * @returns Processed content with alert box syntax converted to HTML
 */
const processAlertBoxes = (content: string): string => {
  // Regular expression to match alert box syntax
  // Captures the alert type and content between ::: markers
  const alertRegex = /:::(tip|info|warning|danger)\n([\s\S]*?):::/g;
  
  // Replace all matches with custom HTML for alert boxes
  return content.replace(alertRegex, (match, type, content) => {
    // Trim content to remove extra whitespace
    const trimmedContent = content.trim();
    
    // Generate icon HTML based on alert type
    let iconHtml = '';
    
    switch (type) {
      case 'tip':
        // Lightbulb icon for tips
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="${styles.alertIcon}">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm-1 17h2v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zm3-2v-1H9v1h5z" />
        </svg>`;
        break;
      case 'info':
        // Information icon
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="${styles.alertIcon}">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>`;
        break;
      case 'warning':
        // Circle warning/exclamation icon
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="${styles.alertIcon}">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm0 10c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
        </svg>`;
        break;
      case 'danger':
        // Danger/alert icon
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="${styles.alertIcon}">
          <path d="M12 2L1 21h22L12 2zm0 15a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-8a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-3 0v-4A1.5 1.5 0 0112 9z" />
        </svg>`;
        break;
    }
    
    // Return HTML for the alert box with appropriate styling
    return `<div class="${styles.alertBox} ${styles[`alert${type.charAt(0).toUpperCase() + type.slice(1)}`]}">
      ${iconHtml}
      <div class="${styles.alertContent}">
        <p>${trimmedContent}</p>
      </div>
    </div>`;
  });
};

/**
 * Analyze image alt text to extract options and pure text
 * @param altText - Original alt text
 * @returns Processed information object (pure text, width, shadow presence, caption display)
 */
const extractImageOptions = (altText: string) => {
  let processedAlt = altText || "Image";
  let width: number | undefined;
  let hasShadow = false;
  let showCaption = true;
  let align: string | undefined;
  
  // Find all options starting with !
  const optionRegex = /!([\w-]+(=[\w-]+)?)\b/g;
  const allOptions = processedAlt.match(optionRegex) || [];
  
  // Process all discovered options
  allOptions.forEach(option => {
    // Process known specific options
    if (option === '!shadow') {
      hasShadow = true;
    } else if (option.startsWith('!width=')) {
      const widthValue = option.match(/!width=(\d+)/)?.[1];
      if (widthValue) {
        width = parseInt(widthValue, 10);
      }
    } else if (option === '!nocap') {
      showCaption = false;
    } else if (option.startsWith('!align=')) {
      align = option.match(/!align=(\w+)/)?.[1];
    }
    
    // Remove option from text
    processedAlt = processedAlt.replace(option, '');
  });
  
  // Remove duplicate spaces and trim
  processedAlt = processedAlt.replace(/\s+/g, ' ').trim();
  
  // Set default value if text is empty
  if (!processedAlt || processedAlt === '') {
    processedAlt = "Image";
  }
  
  return {
    pureAltText: processedAlt,
    width,
    hasShadow,
    showCaption,
    align
  };
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Pre-process LaTeX expressions
  const processedLatex = preprocessLatex(content);
  
  // Process alert boxes after LaTeX processing
  const processedContent = processAlertBoxes(processedLatex);

  // Load KaTeX CSS dynamically when math content is detected
  React.useEffect(() => {
    const hasMath = content && (content.includes('$') || content.includes('\\(') || content.includes('\\['));
    
    if (hasMath) {
      // Dynamically load KaTeX CSS only when needed
      // @ts-expect-error - CSS files don't have TypeScript definitions
      import('katex/dist/katex.min.css').catch(error => {
        console.error('Failed to load KaTeX CSS:', error);
      });
    }
  }, [content]);
  // Safe client-only useEffect - resolving hydration issues
  useEffect(() => {
    // Skip execution in server-side rendering
    if (typeof window === 'undefined') return;

    // Only runs in browser environment
    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;
      
      try {
        // DOM manipulation that only executes on the client side
        document.querySelectorAll('.katex, .katex-display').forEach(el => {
          if (el && el.classList) {
            el.classList.add('katex-repaint');
            requestAnimationFrame(() => {
              if (isMounted && el && el.classList) {
                el.classList.remove('katex-repaint');
              }
            });
          }
        });
      } catch (error) {
        console.error('Error processing KaTeX elements:', error);
      }
    }, 100); // Small delay to ensure execution after hydration completes

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [processedContent]);
  
  return (
    <div className={`${styles.markdownContent} ${className} markdown-body`} suppressHydrationWarning>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, {
            strict: false,
            throwOnError: false,
            errorColor: 'red',
            trust: true
          }],
          rehypeRaw
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
            const match = /language-(\w+!?)/.exec(originalClassName);
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
                : (children !== undefined && children !== null) 
                  ? String(children) 
                  : '';
                
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
            
            // Check if paragraph contains an image
            const hasImageChild = node?.children?.some((child: any) => 
              child?.type === 'element' && child?.tagName === 'img'
            );
            
            if (hasImageChild) {
              // If paragraph contains an image, use div instead of p
              return (
                <div className={styles.imageParagraph} {...props}>
                  {children}
                </div>
              );
            }
            
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
          a: ({ children, href, ...props }: any) => {
            const childText = String(children);
            
            // Check for special link types
            if (childText.startsWith('!docs ')) {
              // Documentation link
              const linkText = childText.replace('!docs ', '');
              return (
                <a 
                  className={styles.docsLink} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  {...props}
                >
                  <span className={styles.docsIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </span>
                  {linkText}
                </a>
              );
            } else if (childText.startsWith('!download ')) {
              // Download link
              const linkText = childText.replace('!download ', '');
              return (
                <a 
                  className={styles.downloadLink} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  {...props}
                >
                  <span className={styles.downloadIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </span>
                  {linkText}
                </a>
              );
            } else if (childText.startsWith('!lnk ')) {
              // Social/User link
              const linkText = childText.replace('!lnk ', '');
              
              // Extract domain from href for favicon
              let domain = '';
              if (href) {
                try {
                  domain = new URL(href).hostname;
                } catch {
                  // Invalid URL, just use the href as is
                  domain = href;
                }
              }
              
              return (
                <a 
                  className={styles.socialLink} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  data-domain={domain}
                  {...props}
                >
                  <span className={styles.faviconContainer}>
                    {domain && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                        alt=""
                        className={styles.favicon}
                        width="16"
                        height="16"
                        onError={(evt) => {
                          // Fallback icon if favicon fails to load
                          const target = evt.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackIcon = document.createElement('svg');
                            fallbackIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                            fallbackIcon.setAttribute('viewBox', '0 0 24 24');
                            fallbackIcon.setAttribute('width', '16');
                            fallbackIcon.setAttribute('height', '16');
                            fallbackIcon.setAttribute('fill', 'none');
                            fallbackIcon.setAttribute('stroke', 'currentColor');
                            fallbackIcon.setAttribute('stroke-width', '2');
                            fallbackIcon.setAttribute('stroke-linecap', 'round');
                            fallbackIcon.setAttribute('stroke-linejoin', 'round');
                            fallbackIcon.innerHTML = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>';
                            parent.appendChild(fallbackIcon);
                          }
                        }}
                      />
                    )}
                  </span>
                  {linkText}
                </a>
              );
            } else {
              // Regular link
              return (
                <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              );
            }
          },
          blockquote: ({ children, ...props }: any) => (
            <blockquote className={styles.blockquote} {...props}>
              {children}
            </blockquote>
          ),
          img: ({ src, ...props }: any) => {
            // Extract options from image alt text
            const altText = props.alt || "Markdown image";
            const { pureAltText, width, hasShadow, showCaption, align } = extractImageOptions(altText);
            
            // Create style object - filter: drop-shadow is handled in CSS class
            const styleObj: React.CSSProperties = {
              ...(width ? { width: `${width}px`, height: 'auto' } : {}),
              // hasShadow is now applied only through CSS class
            };
            
            // Merge alignment style
            const finalStyle = { ...styleObj };
            
            // Create custom class
            let imageClassName = `${styles.image}`;
            if (hasShadow) imageClassName += ` ${styles.imageShadow}`;
            
            // Determine image alignment class
            const alignValue = align || 'center'; // Default is center alignment
            imageClassName += ` ${styles[`image${alignValue.charAt(0).toUpperCase() + alignValue.slice(1)}`]}`;
            
            // Set container style and class
            const containerStyle: React.CSSProperties = {};
            if (width) {
              containerStyle.width = `${width}px`;
              containerStyle.maxWidth = '100%';
            }
            
            // Set container class - always applied according to alignment
            const containerClassName = `${styles.imageContainer} ${styles[`container${alignValue.charAt(0).toUpperCase() + alignValue.slice(1)}`]}`;
            
            // Wrap image in figure element to separate from content flow
            return (
              <span className={containerClassName} style={containerStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className={imageClassName} 
                  src={src} 
                  alt={pureAltText}
                  title={showCaption ? pureAltText : ''}
                  style={finalStyle}
                  {...props} 
                />
                {showCaption && pureAltText !== "Image" && (
                  <span className={`${styles.imageCaption} ${styles.captionCenter}`}>{pureAltText}</span>
                )}
              </span>
            );
          },
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