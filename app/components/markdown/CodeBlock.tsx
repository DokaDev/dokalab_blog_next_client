'use client';

import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './MarkdownRenderer.module.scss';
import CodeBlockClient from './CodeBlockClient';

interface CodeBlockProps {
  language: string;
  value: string;
  fileName?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, fileName = '' }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setIsScrolling(true);
    
    // 이전 타이머 취소
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    // 새 타이머 설정
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // 스크롤 멈춘 후 1초 뒤에 스크롤바 숨김
  };
  
  // 마우스 호버 이벤트 핸들러
  const handleMouseEnter = () => {
    setIsScrolling(true);
  };
  
  // 마우스 아웃 이벤트 핸들러
  const handleMouseLeave = () => {
    // 스크롤 중이 아닐 때만 상태 변경
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  if (!value || value.trim() === '') {
    return <div className={styles.codeBlockWrapper}><div>Empty code block</div></div>;
  }

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
      <CodeBlockClient value={value} fileName={fileName} language={language} />
      
      <div style={{ 
        backgroundColor: '#f8fafc',
        position: 'relative',
        width: '100%'
      }}>
        <div 
          ref={scrollContainerRef}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'block',
            width: '100%'
          }}
          className={`code-scroll-container ${isScrolling ? 'is-scrolling' : ''}`}
          onScroll={handleScroll}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
            wrapLines={false}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: 0,
              minWidth: 'max-content'
            }}
          >
            {value.replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock; 