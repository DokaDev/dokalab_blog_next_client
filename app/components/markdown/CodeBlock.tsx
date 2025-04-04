'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownRenderer.module.scss';

// Dynamically import client components for code rendering
const CodeBlockClient = dynamic(() => import('./CodeBlockClient'), { ssr: true });
const SyntaxHighlighterClient = dynamic(() => import('./SyntaxHighlighterClient'), { ssr: true });
// Import MermaidRenderer with correct type
interface MermaidProps {
  code: string;
}
const MermaidRenderer = dynamic<MermaidProps>(() => import('./MermaidRenderer'), { ssr: false });

interface CodeBlockProps {
  language: string;
  value: string;
  fileName?: string;
  highlightLines?: number[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, fileName = '', highlightLines = [] }) => {
  // Extract the base language without ! marker
  const baseLanguage = language.replace('!', '');
  const shouldDefaultToDiagram = language.endsWith('!');
  
  // Set initial showCode state based on if language ends with !
  const [showCode, setShowCode] = useState(!shouldDefaultToDiagram);
  
  if (!value || value.trim() === '') {
    return <div className={styles.codeBlockWrapper}><div>Empty code block</div></div>;
  }

  // Check if this is a Mermaid diagram
  const isMermaid = baseLanguage === 'mermaid';
  
  return (
    <div className={styles.codeBlockWrapper}>
      {/* Header section as client component for interactive features */}
      <CodeBlockClient 
        value={value} 
        fileName={fileName} 
        language={baseLanguage} 
        isMermaid={isMermaid}
        showCode={showCode}
        setShowCode={setShowCode}
      />
      
      {/* If it's a Mermaid diagram and we're not showing code, show the diagram */}
      {isMermaid && !showCode ? (
        <MermaidRenderer code={value} />
      ) : (
        /* Otherwise show the syntax highlighter */
        <SyntaxHighlighterClient 
          language={baseLanguage}
          value={value}
          highlightLines={highlightLines}
        />
      )}
    </div>
  );
};

export default CodeBlock; 