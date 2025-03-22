import React from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownRenderer.module.scss';

// Dynamically import client components for code rendering
const CodeBlockClient = dynamic(() => import('./CodeBlockClient'), { ssr: true });
const SyntaxHighlighterClient = dynamic(() => import('./SyntaxHighlighterClient'), { ssr: true });

interface CodeBlockProps {
  language: string;
  value: string;
  fileName?: string;
  highlightLines?: number[];
}

// Server component (default)
const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, fileName = '', highlightLines = [] }) => {
  if (!value || value.trim() === '') {
    return <div className={styles.codeBlockWrapper}><div>Empty code block</div></div>;
  }

  return (
    <div className={styles.codeBlockWrapper}>
      {/* Header section as client component for interactive features */}
      <CodeBlockClient value={value} fileName={fileName} language={language} />
      
      {/* Syntax highlighter section as client component for styling and interactions */}
      <SyntaxHighlighterClient 
        language={language}
        value={value}
        highlightLines={highlightLines}
      />
    </div>
  );
};

export default CodeBlock; 