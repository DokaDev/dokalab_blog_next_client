'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownRenderer.module.scss';

// 타입스크립트 에러를 방지하기 위한 더미 타입 정의
interface DynamicMermaidProps {
  code: string;
}

// Dynamically import client components for code rendering
const CodeBlockClient = dynamic(() => import('./CodeBlockClient'), { ssr: true });
const SyntaxHighlighterClient = dynamic(() => import('./SyntaxHighlighterClient'), { ssr: true });

// 간단한 스켈레톤 로딩 컴포넌트
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

        {diagramType === 'sequence' && (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '50px', width: '80%', height: '150px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '30px', 
                border: '2px solid #ddd', 
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
              <div style={{ width: '1px', height: '120px', background: '#ddd', marginTop: '5px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '30px', 
                border: '2px solid #ddd', 
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.2s'
              }} />
              <div style={{ width: '1px', height: '120px', background: '#ddd', marginTop: '5px' }} />
            </div>
          </div>
        )}

        {diagramType === 'class' && (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '40px', width: '80%' }}>
            <div style={{ width: '120px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                width: '100%', 
                height: '30px', 
                borderTopLeftRadius: '4px', 
                borderTopRightRadius: '4px', 
                borderBottom: '1px solid #ccc',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
              <div style={{ 
                width: '100%', 
                height: '60px', 
                borderBottomLeftRadius: '4px', 
                borderBottomRightRadius: '4px',
                background: 'linear-gradient(90deg, #f1f1f1 25%, #e8e8e8 50%, #f1f1f1 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.2s'
              }} />
            </div>
            <div style={{ width: '120px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                width: '100%', 
                height: '30px', 
                borderTopLeftRadius: '4px', 
                borderTopRightRadius: '4px', 
                borderBottom: '1px solid #ccc',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.4s'
              }} />
              <div style={{ 
                width: '100%', 
                height: '60px', 
                borderBottomLeftRadius: '4px', 
                borderBottomRightRadius: '4px',
                background: 'linear-gradient(90deg, #f1f1f1 25%, #e8e8e8 50%, #f1f1f1 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.6s'
              }} />
            </div>
          </div>
        )}

        {diagramType === 'gantt' && (
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '15px', width: '80%' }}>
            <div style={{ width: '100%', height: '30px', display: 'flex', gap: '5px', alignItems: 'center' }}>
              <div style={{ width: '20%', height: '20px', background: '#ddd' }} />
              <div style={{ width: '80%', height: '20px', display: 'flex', gap: '3px' }}>
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} style={{ width: '10%', height: '20px', background: '#f0f0f0', border: '1px solid #e8e8e8' }} />
                ))}
              </div>
            </div>
            <div style={{ width: '100%', height: '25px', display: 'flex', gap: '5px' }}>
              <div style={{ width: '20%', height: '20px', background: '#ddd' }} />
              <div style={{ 
                width: '30%', 
                height: '20px', 
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
            </div>
            <div style={{ width: '100%', height: '25px', display: 'flex', gap: '5px' }}>
              <div style={{ width: '20%', height: '20px', background: '#ddd' }} />
              <div style={{ 
                width: '40%', 
                height: '20px',
                borderRadius: '3px', 
                marginLeft: '15%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.3s'
              }} />
            </div>
          </div>
        )}

        {diagramType === 'default' && (
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

// 스켈레톤 로더를 사용하여 MermaidRenderer 로딩 상태 표시
const MermaidRenderer = dynamic<DynamicMermaidProps>(
  // @ts-ignore - 모듈을 찾을 수 없는 TypeScript 오류 무시
  () => import('./MermaidRenderer'), 
  { 
    ssr: false, 
    loading: ({ code }) => {
      // 코드를 직접 전달하여 스켈레톤 타입을 즉시 결정
      try {
        return <MermaidSkeletonLoader code={code} />
      } catch (e) {
        return <MermaidSkeletonLoader />
      }
    }
  }
);

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
  
  // Determine if we should show the diagram
  const shouldRenderDiagram = isMermaid && !showCode;
  
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
      
      {/* Content section */}
      <div className={styles.codeBlockContent}>
        {/* If it's a Mermaid diagram and we're not showing code, show the diagram */}
        {shouldRenderDiagram ? (
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
    </div>
  );
};

export default CodeBlock; 