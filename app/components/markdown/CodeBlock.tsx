'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownRenderer.module.scss';
import CodeBlockSkeleton from './CodeBlockSkeleton';

// Dynamically import client components for code rendering
const CodeBlockClient = dynamic(() => import('./CodeBlockClient'), { ssr: true });
const SyntaxHighlighterClient = dynamic(() => import('./SyntaxHighlighterClient'), { 
  ssr: false,
  loading: () => <CodeBlockSkeleton />
});

// Simple skeleton loading component
const MermaidSkeletonLoader = ({ code = '' }: { code?: string }) => {
  // Extract diagram type from code
  let diagramType = 'default';
  if (code && typeof code === 'string') {
    const trimmedCode = code.trim();
    if (trimmedCode.startsWith('graph') || trimmedCode.startsWith('flowchart')) {
      diagramType = 'flowchart';
    } else if (trimmedCode.startsWith('sequenceDiagram')) {
      diagramType = 'sequence';
    } else if (trimmedCode.startsWith('classDiagram')) {
      diagramType = 'class';
    } else if (trimmedCode.startsWith('gantt')) {
      diagramType = 'gantt';
    } else if (trimmedCode.startsWith('pie')) {
      diagramType = 'pie';
    }
  }

  return (
    <div 
      style={{ 
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        overflowX: 'auto',
        borderTop: '1px solid #e2e8f0',
        minHeight: '250px',
        height: 'auto',
        position: 'relative'
      }}
    >
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '220px'
      }}>
        {diagramType === 'flowchart' && (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '30px', width: '80%' }}>
            <div style={{
              width: '80px',
              height: '40px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
            <div style={{ width: '40px', height: '1px', background: '#ddd' }} />
            <div style={{
              width: '80px',
              height: '40px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              animationDelay: '0.2s'
            }} />
          </div>
        )}

        {diagramType === 'pie' && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'conic-gradient(#f0f0f0 0% 25%, #e0e0e0 25% 60%, #d8d8d8 60% 85%, #e8e8e8 85% 100%)',
            boxShadow: 'inset 0 0 0 2px #ddd',
            animation: 'rotate 3s infinite linear'
          }} />
        )}

        {(diagramType !== 'flowchart' && diagramType !== 'pie') && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '80%',
            height: '120px',
            borderRadius: '8px',
            border: '2px dashed #ddd',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        )}

        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.8)',
          padding: '6px 16px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          fontWeight: 500
        }}>
          In rendering...
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Using skeleton loader to display MermaidRenderer loading state
// Using any type to avoid TypeScript errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MermaidRenderer: any = dynamic(() => import('./MermaidRenderer'), {
  ssr: false,
  loading: () => <MermaidSkeletonLoader />
});

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
  
  // Check if the value is empty, undefined, or null
  const isEmpty = !value || value.trim() === '' || value === 'undefined' || value === 'null';

  // Check if this is a Mermaid diagram
  const isMermaid = baseLanguage === 'mermaid';
  
  // Determine if we should show the diagram
  const shouldRenderDiagram = isMermaid && !showCode;
  
  return (
    <div className={styles.codeBlockWrapper}>
      {/* Header section as client component for interactive features */}
      <CodeBlockClient 
        value={isEmpty ? '' : value} 
        fileName={fileName} 
        language={baseLanguage} 
        isMermaid={isMermaid}
        showCode={showCode}
        setShowCode={setShowCode}
      />
      
      {/* Content section */}
      <div className={styles.codeBlockContent}>
        {/* If it's a Mermaid diagram and we're not showing code, show the diagram */}
        {shouldRenderDiagram ? (
          <MermaidRenderer code={value} />
        ) : isEmpty ? (
          /* Show empty block message without syntax highlighting */
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            color: '#64748b',
            fontSize: '14px',
            fontStyle: 'italic',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Empty Code Block
          </div>
        ) : (
          /* Otherwise show the syntax highlighter */
          <SyntaxHighlighterClient 
            language={baseLanguage}
            value={value}
            highlightLines={highlightLines}
          />
        )}
      </div>
    </div>
  );
};

export default CodeBlock; 