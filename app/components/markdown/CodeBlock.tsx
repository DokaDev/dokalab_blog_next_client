'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './MarkdownRenderer.module.scss';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverMinimize, setHoverMinimize] = useState(false);
  const [hoverMaximize, setHoverMaximize] = useState(false);

  // oneLight 테마를 복제하고 폰트 크기 지정
  const customStyle = {
    ...oneLight,
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontSize: '14.4px',
    },
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      fontSize: '14.4px',
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.8rem 1rem',
          margin: 0,
          boxSizing: 'border-box',
          height: 'auto',
          minHeight: 0,
          lineHeight: 1,
        }}
      >
        <div 
          style={{
            display: 'flex', 
            alignItems: 'center',
            padding: 0,
            gap: '0.5rem',
            height: 'auto',
            minHeight: 0,
            margin: 0,
            lineHeight: 0,
          }}
        >
          <span 
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ff5f56',
              border: '1px solid #e0443e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
            }}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
          >
            {hoverClose && (
              <svg 
                width="8" 
                height="8" 
                viewBox="0 0 8 8" 
                style={{ position: 'absolute' }}
              >
                <line 
                  x1="1.5" 
                  y1="1.5" 
                  x2="6.5" 
                  y2="6.5" 
                  stroke="#9a0000" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                />
                <line 
                  x1="6.5" 
                  y1="1.5" 
                  x2="1.5" 
                  y2="6.5" 
                  stroke="#9a0000" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                />
              </svg>
            )}
          </span>
          <span 
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
              border: '1px solid #dea123',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
            }}
            onMouseEnter={() => setHoverMinimize(true)}
            onMouseLeave={() => setHoverMinimize(false)}
          >
            {hoverMinimize && (
              <svg 
                width="8" 
                height="8" 
                viewBox="0 0 8 8" 
                style={{ position: 'absolute' }}
              >
                <line 
                  x1="1.5" 
                  y1="4" 
                  x2="6.5" 
                  y2="4" 
                  stroke="#985700" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                />
              </svg>
            )}
          </span>
          <span 
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#27c93f',
              border: '1px solid #1aab29',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
            }}
            onMouseEnter={() => setHoverMaximize(true)}
            onMouseLeave={() => setHoverMaximize(false)}
          >
            {hoverMaximize && (
              <svg 
                width="8" 
                height="8" 
                viewBox="0 0 8 8" 
                style={{ position: 'absolute' }}
              >
                <line 
                  x1="4" 
                  y1="1.5" 
                  x2="4" 
                  y2="6.5" 
                  stroke="#006500" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                />
                <line 
                  x1="1.5" 
                  y1="4" 
                  x2="6.5" 
                  y2="4" 
                  stroke="#006500" 
                  strokeWidth="1.25" 
                  strokeLinecap="round" 
                />
              </svg>
            )}
          </span>
        </div>
        {language && (
          <span 
            style={{
              fontFamily: 'Menlo, Monaco, Consolas, monospace',
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              margin: 0,
              lineHeight: 1,
              height: 'auto',
            }}
          >
            {language}
          </span>
        )}
      </div>
      <SyntaxHighlighter
        style={customStyle}
        language={language}
        PreTag="div"
        codeTagProps={{ style: { fontSize: '14.4px' } }}
      >
        {value.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock; 