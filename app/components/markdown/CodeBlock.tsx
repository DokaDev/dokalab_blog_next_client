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
  // 창 컨트롤 버튼들의 통합 hover 상태
  const [hoverWindowControls, setHoverWindowControls] = useState(false);
  const [hoverCopy, setHoverCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  // 클립보드에 코드 복사하는 함수
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // oneLight 테마를 복제하고 폰트 크기 지정
  const customStyle = {
    ...oneLight,
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontSize: '14.4px',
      background: 'none',
      padding: 0,
    },
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      fontSize: '14.4px',
      margin: 0,
      padding: '1.25rem',
      borderRadius: 0,
      background: '#f8fafc',
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
          padding: '0.6rem 1rem',
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
          onMouseEnter={() => setHoverWindowControls(true)}
          onMouseLeave={() => setHoverWindowControls(false)}
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
          >
            {hoverWindowControls && (
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
          >
            {hoverWindowControls && (
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
          >
            {hoverWindowControls && (
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
          <button
            onClick={copyToClipboard}
            onMouseEnter={() => setHoverCopy(true)}
            onMouseLeave={() => setHoverCopy(false)}
            style={{
              background: hoverCopy ? '#e2e8f0' : 'none',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 6px',
              margin: 0,
              marginLeft: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              width: '24px',
              height: '22px',
            }}
            title="Copy code"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hoverCopy ? '#1F2937' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
      </div>
      <div style={{ backgroundColor: '#f8fafc' }}>
        <SyntaxHighlighter
          style={customStyle}
          language={language}
          PreTag="div"
          codeTagProps={{ style: { fontSize: '14.4px' } }}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: '2.5em', 
            paddingRight: '1em', 
            color: '#AAA',
            borderRight: '1px solid #E2E8F0',
            marginRight: '1em',
            textAlign: 'right'
          }}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: '#f8fafc',
            borderRadius: 0,
          }}
        >
          {value.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock; 