'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CodeBlockClientProps {
  value: string;
  fileName?: string;
  language?: string;
  isMermaid?: boolean;
  showCode?: boolean;
  setShowCode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeBlockClient: React.FC<CodeBlockClientProps> = ({ 
  value, 
  fileName = '', 
  language = '', 
  isMermaid = false,
  showCode = false,
  setShowCode
}) => {
  const [hoverWindowControls, setHoverWindowControls] = useState(false);
  const [hoverCopy, setHoverCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFileNameTooltip, setShowFileNameTooltip] = useState(false);
  const [showToggleTooltip, setShowToggleTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toggleTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate number of code lines
  const lineCount = value.split('\n').length;
  // Adjust padding based on line count
  const getHeaderPadding = () => {
    if (lineCount <= 2) {
      return isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem';
    }
    return '0.6rem 1rem';
  };
  
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
  
  // Toggle between code view and diagram view 
  const toggleView = () => {
    if (setShowCode) {
      setShowCode(!showCode);
    }
  };
  
  // Handle toggle tooltip functions
  const handleToggleMouseEnter = () => {
    setShowToggleTooltip(true);
  };
  
  const handleToggleMouseLeave = () => {
    if (toggleTooltipTimeoutRef.current) {
      clearTimeout(toggleTooltipTimeoutRef.current);
    }
    
    toggleTooltipTimeoutRef.current = setTimeout(() => {
      setShowToggleTooltip(false);
    }, 300);
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
    // Check if it's an empty code block
    if (!value || value.trim() === '') {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
      return;
    }
    
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
        padding: getHeaderPadding(), // Adjust padding based on line count
        margin: 0,
        boxSizing: 'border-box',
        height: 'auto',
        minHeight: 0,
        lineHeight: 1,
      }}
      data-line-count={lineCount}
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
            background: copyFailed ? '#fecaca' : (hoverCopy ? '#e2e8f0' : 'none'),
            border: 'none',
            borderRadius: '4px',
            padding: '4px 6px',
            margin: 0,
            marginLeft: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: copyFailed ? 'all 0.3s ease' : 'background-color 0.2s',
            width: '24px',
            height: '22px',
            animation: copyFailed ? 'shake 0.5s ease-in-out' : 'none',
            position: 'relative',
          }}
          title={(!value || value.trim() === '') ? "Empty code block" : "Copy code"}
          aria-label={(!value || value.trim() === '') ? "Empty code block" : "Copy code to clipboard"}
        >
          {copyFailed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : copied ? (
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
        
        {/* Toggle switch for Mermaid diagrams */}
        {isMermaid && setShowCode && (
          <div style={{ position: 'relative' }}>
            <div
              onClick={toggleView}
              onMouseEnter={handleToggleMouseEnter}
              onMouseLeave={handleToggleMouseLeave}
              style={{
                position: 'relative',
                width: '32px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: '#e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '1px',
                marginLeft: '0.5rem',
                boxSizing: 'border-box',
                transition: 'background-color 0.2s ease',
              }}
              title={showCode ? "Show diagram" : "Show code"}
              aria-label={showCode ? "Show diagram" : "Show code"}
              role="switch"
              aria-checked={showCode}
            >
              {/* Toggle knob with subtle icon */}
              <div
                style={{
                  position: 'absolute',
                  left: showCode ? '2px' : 'calc(100% - 14px - 2px)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Code icon (left position) - simplified */}
                {showCode && (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                )}
                
                {/* Diagram icon (right position) - simplified */}
                {!showCode && (
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                )}
              </div>
            </div>
            
            {/* Custom tooltip - keep as is */}
            {showToggleTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#334155',
                  color: 'white',
                  borderRadius: '4px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  marginTop: '6px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  textAlign: 'center',
                }}
              >
                {showCode ? "Switch to diagram view" : "Switch to code view"}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#334155',
                    zIndex: -1,
                  }}
                />
              </div>
            )}
          </div>
        )}
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