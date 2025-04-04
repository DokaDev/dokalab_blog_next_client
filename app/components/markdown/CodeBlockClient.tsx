'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CodeBlockClientProps {
  value: string;
  fileName?: string;
  language?: string;
}

const CodeBlockClient: React.FC<CodeBlockClientProps> = ({ value, fileName = '', language = '' }) => {
  const [hoverWindowControls, setHoverWindowControls] = useState(false);
  const [hoverCopy, setHoverCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFileNameTooltip, setShowFileNameTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add button click states
  const [redButtonClicked, setRedButtonClicked] = useState(false);
  const [yellowButtonClicked, setYellowButtonClicked] = useState(false);
  const [greenButtonClicked, setGreenButtonClicked] = useState(false);
  
  // Handle button mouse down function
  const handleButtonDown = (button: 'red' | 'yellow' | 'green') => {
    if (button === 'red') setRedButtonClicked(true);
    if (button === 'yellow') setYellowButtonClicked(true);
    if (button === 'green') setGreenButtonClicked(true);
  };
  
  // Handle button mouse up/leave function
  const handleButtonUp = (button: 'red' | 'yellow' | 'green') => {
    if (button === 'red') setRedButtonClicked(false);
    if (button === 'yellow') setYellowButtonClicked(false);
    if (button === 'green') setGreenButtonClicked(false);
  };

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  const handleFileIconClick = () => {
    setShowFileNameTooltip(!showFileNameTooltip);
    
    // Auto-hide tooltip after 3 seconds
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowFileNameTooltip(false);
    }, 3000);
  };
  
  const handleFileIconMouseEnter = () => {
    setShowFileNameTooltip(true);
  };
  
  const handleFileIconMouseLeave = () => {
    setShowFileNameTooltip(false);
  };

  return (
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
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
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
              backgroundColor: redButtonClicked ? '#cc4840' : '#ff5f56',
              border: '1px solid #e0443e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
              boxShadow: redButtonClicked ? 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'background-color 0.05s, box-shadow 0.05s',
            }}
            onMouseDown={() => handleButtonDown('red')}
            onMouseUp={() => handleButtonUp('red')}
            onMouseLeave={() => handleButtonUp('red')}
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
              backgroundColor: yellowButtonClicked ? '#d29b25' : '#ffbd2e',
              border: '1px solid #dea123',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
              boxShadow: yellowButtonClicked ? 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'background-color 0.05s, box-shadow 0.05s',
            }}
            onMouseDown={() => handleButtonDown('yellow')}
            onMouseUp={() => handleButtonUp('yellow')}
            onMouseLeave={() => handleButtonUp('yellow')}
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
              backgroundColor: greenButtonClicked ? '#1ca02d' : '#27c93f',
              border: '1px solid #1aab29',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'relative',
              cursor: 'default',
              boxShadow: greenButtonClicked ? 'inset 0px 1px 3px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'background-color 0.05s, box-shadow 0.05s',
            }}
            onMouseDown={() => handleButtonDown('green')}
            onMouseUp={() => handleButtonUp('green')}
            onMouseLeave={() => handleButtonUp('green')}
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
        </div>
        
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
          aria-label="Copy code to clipboard"
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

      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {fileName && (
          <>
            {isMobile ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleFileIconClick}
                  onMouseEnter={handleFileIconMouseEnter}
                  onMouseLeave={handleFileIconMouseLeave}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 6px',
                    margin: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                    height: '22px',
                  }}
                  title={fileName}
                  aria-label={`File: ${fileName}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </button>
                
                {showFileNameTooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#334155',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      marginTop: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  >
                    {fileName}
                  </div>
                )}
              </div>
            ) : (
              <>
                <span 
                  style={{
                    fontFamily: 'Menlo, Monaco, Consolas, monospace',
                    fontSize: '12px',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {fileName}
                </span>
              </>
            )}
            {language && (
              <>
                <span style={{
                  width: '1px',
                  height: '1rem',
                  backgroundColor: '#cbd5e1',
                  margin: '0 0.25rem',
                }}></span>
              </>
            )}
          </>
        )}
        {language && (
          <span 
            style={{
              fontFamily: 'Menlo, Monaco, Consolas, monospace',
              fontSize: '12px',
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
  );
};

export default CodeBlockClient; 