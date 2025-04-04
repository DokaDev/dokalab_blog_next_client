'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  code: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
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
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        setError('Failed to render diagram. Check your Mermaid syntax.');
      }
    };

    renderDiagram();
  }, [code]);

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