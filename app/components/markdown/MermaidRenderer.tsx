'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  code: string;
}

// 렌더링 지연 방지를 위해 초기 로딩 시간을 짧게 설정
const MIN_LOADING_TIME = 300; // 최소 300ms 동안은 로딩 상태 유지

// 다이어그램 유형을 감지하는 함수
const detectDiagramType = (code: string): string => {
  const trimmedCode = code.trim();
  if (trimmedCode.startsWith('graph') || trimmedCode.startsWith('flowchart')) {
    return 'flowchart';
  } else if (trimmedCode.startsWith('sequenceDiagram')) {
    return 'sequence';
  } else if (trimmedCode.startsWith('classDiagram')) {
    return 'class';
  } else if (trimmedCode.startsWith('gantt')) {
    return 'gantt';
  } else if (trimmedCode.startsWith('pie')) {
    return 'pie';
  }
  return 'default';
};

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // 다이어그램 유형을 컴포넌트 초기화 시점에 감지
  const [diagramType, setDiagramType] = useState<string>(detectDiagramType(code));
  const [renderStartTime, setRenderStartTime] = useState<number>(0);

  useEffect(() => {
    // 컴포넌트가 마운트되자마자 타임스탬프 기록
    setRenderStartTime(Date.now());
    
    // 코드가 변경되면 다이어그램 유형도 다시 감지
    setDiagramType(detectDiagramType(code));
    
    // 렌더링 시작 시 명시적으로 로딩 상태로 설정
    setLoading(true);
    
    // 다음 프레임에서 렌더링 시작 (스켈레톤이 먼저 보이도록)
    // requestAnimationFrame을 사용하여 UI가 먼저 업데이트되도록 함
    const timer = requestAnimationFrame(() => {
      // 추가 타임아웃으로 스켈레톤이 확실히 보이도록 함
      setTimeout(async () => {
        try {
          // Initialize mermaid
          mermaid.initialize({
            startOnLoad: true,
            theme: 'default', 
            securityLevel: 'loose',
            flowchart: { 
              htmlLabels: true, 
              curve: 'basis' 
            },
          });

          // Generate a unique ID for this diagram
          const id = `mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(id, code);
          setSvg(svg);
          
          // 최소 로딩 시간을 보장
          const renderTime = Date.now() - renderStartTime;
          if (renderTime < MIN_LOADING_TIME) {
            setTimeout(() => {
              setLoading(false);
            }, MIN_LOADING_TIME - renderTime);
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error('Error rendering Mermaid diagram:', err);
          setError('Failed to render diagram. Check your Mermaid syntax.');
          setLoading(false);
        }
      }, 50); // 스켈레톤이 렌더링될 시간 확보 (50ms)
    });
    
    return () => {
      cancelAnimationFrame(timer);
    };
  }, [code, renderStartTime]);

  if (error) {
    return (
      <div style={{ 
        padding: '1rem', 
        color: 'red', 
        backgroundColor: '#fef2f2', 
        borderTop: '1px solid #fee2e2',
        fontFamily: 'monospace' 
      }}>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        style={{ 
          padding: '1rem',
          backgroundColor: '#f9f9f9', // Lighter static background
          overflowX: 'auto',
          borderTop: '1px solid #e2e8f0',
          minHeight: '250px',
          height: 'auto',
          position: 'relative',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* Skeleton UI based on diagram type */}
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '220px',
          opacity: '1',
          transition: 'opacity 0.3s ease-in-out'
        }}>
          {/* 모든 다이어그램 타입에 대한 로더를 미리 렌더링하고 opacity로 전환 */}
          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: diagramType === 'flowchart' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
              <div style={{ width: '40px', height: '1px', background: '#ddd' }} />
              <div style={{ 
                width: '80px', 
                height: '40px', 
                border: '2px solid #ddd', 
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.4s'
              }} />
            </div>
          </div>

          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: diagramType === 'pie' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
          </div>

          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: diagramType === 'sequence' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '30px', 
                  border: '2px solid #ddd', 
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  animationDelay: '0.4s'
                }} />
                <div style={{ width: '1px', height: '120px', background: '#ddd', marginTop: '5px' }} />
              </div>
            </div>
          </div>

          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: diagramType === 'class' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
          </div>

          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: diagramType === 'gantt' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
            <div style={{ width: '100%', height: '25px', display: 'flex', gap: '5px' }}>
              <div style={{ width: '20%', height: '20px', background: '#ddd' }} />
              <div style={{ 
                width: '25%', 
                height: '20px', 
                borderRadius: '3px', 
                marginLeft: '30%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                animationDelay: '0.6s'
              }} />
            </div>
          </div>

          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: diagramType === 'default' ? '1' : '0',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
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
          </div>

          <div style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
            color: '#666', 
            position: 'relative', 
            zIndex: 10,
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
  }

  return (
    <div 
      style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        overflowX: 'auto',
        borderTop: '1px solid #e2e8f0'
      }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default MermaidRenderer; 