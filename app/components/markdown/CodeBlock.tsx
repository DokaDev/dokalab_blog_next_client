import React from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownRenderer.module.scss';

// 클라이언트 컴포넌트들을 동적으로 불러옴
const CodeBlockClient = dynamic(() => import('./CodeBlockClient'), { ssr: true });
const SyntaxHighlighterClient = dynamic(() => import('./SyntaxHighlighterClient'), { ssr: true });

interface CodeBlockProps {
  language: string;
  value: string;
  fileName?: string;
  highlightLines?: number[];
}

// 서버 컴포넌트 (기본값)
const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, fileName = '', highlightLines = [] }) => {
  if (!value || value.trim() === '') {
    return <div className={styles.codeBlockWrapper}><div>Empty code block</div></div>;
  }

  return (
    <div className={styles.codeBlockWrapper}>
      {/* 헤더 부분은 클라이언트 컴포넌트로 */}
      <CodeBlockClient value={value} fileName={fileName} language={language} />
      
      {/* SyntaxHighlighter 부분은 클라이언트 컴포넌트로 */}
      <SyntaxHighlighterClient 
        language={language}
        value={value}
        highlightLines={highlightLines}
      />
    </div>
  );
};

export default CodeBlock; 