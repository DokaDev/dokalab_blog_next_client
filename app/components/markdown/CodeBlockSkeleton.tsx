'use client';

import React from 'react';

const CodeBlockSkeleton: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '1rem',
      minHeight: '120px',
    }}>
      {/* Generate skeleton lines */}
      {[...Array(6)].map((_, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: index === 5 ? '0' : '0.4rem',
          gap: '1rem',
        }}>
          {/* Line number skeleton */}
          <div style={{
            width: '1.5rem',
            height: '14px',
            backgroundColor: '#cbd5e1',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: `${index * 0.1}s`,
            flexShrink: 0,
          }} />
          
          {/* Code line skeleton */}
          <div style={{
            width: `${Math.random() * 40 + 30}%`, // Random width between 30-70%
            height: '14px',
            backgroundColor: '#e2e8f0',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            animationDelay: `${index * 0.15}s`,
          }} />
        </div>
      ))}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { 
            background-position: 200% 0; 
          }
          100% { 
            background-position: -200% 0; 
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlockSkeleton; 