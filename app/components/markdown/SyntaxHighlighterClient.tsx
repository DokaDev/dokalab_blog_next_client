'use client';

import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface SyntaxHighlighterClientProps {
  language: string;
  value: string;
  highlightLines?: number[];
  isDarkMode?: boolean;
  copyable?: boolean;
  lineHighlight?: string;
  showLineNumbers?: boolean;
  lineNumbers?: string;
}

const SyntaxHighlighterClient: React.FC<SyntaxHighlighterClientProps> = ({ 
  language, 
  value,
  highlightLines = [],
  isDarkMode,
  copyable,
  lineHighlight,
  showLineNumbers,
  lineNumbers
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasOverflowX, setHasOverflowX] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect screen size
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Desktop also needs overflow checking - handled by checkOverflow function
    };
    
    // Initial check
    checkIfMobile();
    
    // Response to resize events
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Scroll event handler
  const handleScroll = () => {
    setIsScrolling(true);
    
    // Set scroll timer - applies to both mobile and desktop
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    scrollTimer.current = setTimeout(() => {
      // Also allow scrollbar to hide after scrolling stops on desktop
      setIsScrolling(false);
    }, isMobile ? 1000 : 2000); // Keep visible longer on desktop
  };
  
  // Mouse hover event handler
  const handleMouseEnter = () => {
    setIsScrolling(true);
  };
  
  // Mouse leave event handler
  const handleMouseLeave = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, isMobile ? 300 : 1000); // Keep visible longer on desktop
  };
  
  // Check for overflow conditions
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // Check if horizontal scrolling is needed for the container
        const hasOverflow = container.scrollWidth > container.clientWidth;
        
        // Only set to true when overflow exists (for both mobile and desktop)
        setHasOverflowX(hasOverflow);
          
        // Directly add/remove classes for explicit handling
        if (hasOverflow) {
          container.classList.add('has-overflow-x');
          container.setAttribute('data-has-overflow', 'true');
          
          // Only apply scroll on desktop when overflow exists
          if (!isMobile) {
            container.style.overflowX = 'scroll';
            container.dataset.alwaysShowScrollbar = 'true';
            // Initially show scrollbar when overflow exists
            setIsScrolling(true);
            // Hide after 2 seconds
            if (scrollTimer.current) {
              clearTimeout(scrollTimer.current);
            }
            scrollTimer.current = setTimeout(() => {
              setIsScrolling(false);
            }, 2000);
          }
        } else {
          container.classList.remove('has-overflow-x');
          container.setAttribute('data-has-overflow', 'false');
          // Auto overflow when no overflow exists
          container.style.overflowX = 'auto';
          container.dataset.alwaysShowScrollbar = 'false';
        }
      }
    };
    
    // Check overflow on initial load and resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check multiple times to ensure complete rendering of code
    const timeoutIds = [
      setTimeout(checkOverflow, 50),
      setTimeout(checkOverflow, 100),
      setTimeout(checkOverflow, 300),
      setTimeout(checkOverflow, 500),
      setTimeout(checkOverflow, 1000)
    ];
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [value, language, isMobile]); // Include mobile state in dependencies
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
      
      // Apply scroll styles only when overflow exists
      if (!isMobile && hasOverflowX) {
        scrollContainer.style.overflowX = 'scroll';
      } else if (!hasOverflowX) {
        scrollContainer.style.overflowX = 'auto';
      }
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [isMobile, hasOverflowX, handleScroll, handleMouseLeave]); // Added dependencies for handleScroll and handleMouseLeave

  // Apply different font sizes for mobile and desktop
  const fontSizeBase = '14px'; // Fixed pixel unit

  const customStyle = {
    ...oneLight,
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontSize: fontSizeBase,
      background: 'none',
      padding: 0,
    },
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      fontSize: fontSizeBase,
      margin: 0,
      padding: isMobile ? '0.8rem' : '1.25rem',
      borderRadius: 0,
      background: '#f8fafc',
    },
    // Internal SyntaxHighlighter styles removed - replaced with global CSS
  };
  
  // Style definition for highlighted lines - only add class names and handle styles in globals.css
  const highlightLineStyle = {
    backgroundColor: 'rgba(100, 74, 201, 0.15)', // Keep only base background color
    fontWeight: 600 // Bold text
  };

  // Desktop scrollbar styles - only apply when overflow exists
  const desktopScrollStyle = !isMobile && hasOverflowX ? {
    overflowX: 'scroll' as const,
    msOverflowStyle: 'scrollbar' as const,
    WebkitOverflowScrolling: 'touch' as const,
  } : {};

  useEffect(() => {
    // Apply theme and copy button settings
    if (scrollContainerRef.current) {
      // Set theme based on system preference
      if (isDarkMode) {
        scrollContainerRef.current.dataset.theme = 'dark';
      } else {
        scrollContainerRef.current.dataset.theme = 'light';
      }
      
      // Apply copyable or non-copyable setting
      if (copyable === false) {
        scrollContainerRef.current.dataset.copyable = 'false';
      } else {
        scrollContainerRef.current.dataset.copyable = 'true';
      }
    }
  }, [isDarkMode, copyable]);

  // Add line highlighting functionality
  useEffect(() => {
    // Skip if no lines to highlight
    if (!lineNumbers) return;
    
    // Get container element
    const codeElement = scrollContainerRef.current;
    if (!codeElement) return;
    
    // Find line numbers container
    const lineNumbersContainer = codeElement.querySelector('.line-numbers-rows');
    if (!lineNumbersContainer) return;
    
    // Process highlight line ranges
    if (showLineNumbers && lineHighlight) {
      // Convert line ranges to array
      const highlightLineNumbers = convertLineHighlightToArray(lineHighlight);
      
      // Get all line elements
      const lineElements = lineNumbersContainer.querySelectorAll('span');
      
      // Highlight specified lines
      highlightLineNumbers.forEach(lineNum => {
        if (lineNum <= lineElements.length) {
          const lineElement = lineElements[lineNum - 1];
          lineElement.classList.add('highlighted-line-number');
          
          // Find the corresponding code line
          const codeLineElement = codeElement.querySelector(`[data-line-number="${lineNum}"]`);
          if (codeLineElement) {
            codeLineElement.classList.add('highlighted-line');
          }
        }
      });
    }
  }, [lineHighlight, showLineNumbers, lineNumbers]);

  // Helper function to convert line highlight string to array of numbers
  const convertLineHighlightToArray = (lineHighlight: string): number[] => {
    const highlightNumbers: number[] = [];
    
    // Split by comma to handle multiple ranges
    const ranges = lineHighlight.split(',');
    
    ranges.forEach(range => {
      // Check if it's a range (contains a hyphen)
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        // Add all numbers in the range
        for (let i = start; i <= end; i++) {
          highlightNumbers.push(i);
        }
      } else {
        // Single line number
        highlightNumbers.push(Number(range));
      }
    });
    
    return highlightNumbers;
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      position: 'relative',
      width: '100%'
    }}>
      <div 
        ref={scrollContainerRef}
        style={{
          overflowX: hasOverflowX ? 'auto' : 'visible', // Enable scrolling only when overflow exists
          overflowY: 'hidden',
          display: 'block',
          width: '100%',
          msOverflowStyle: 'auto',
          WebkitOverflowScrolling: 'touch',
          // Apply scroll styles only when overflow exists
          ...(hasOverflowX ? desktopScrollStyle : {}),
        }}
        className={`code-scroll-container 
          ${isScrolling ? 'is-scrolling' : ''} 
          ${hasOverflowX ? 'has-overflow-x' : ''} 
          ${!isMobile && hasOverflowX ? 'desktop-scrollbar' : ''}`}
        onScroll={handleScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-has-overflow={hasOverflowX ? 'true' : 'false'}
        data-is-desktop={!isMobile ? 'true' : 'false'}
      >
        <SyntaxHighlighter
          style={customStyle}
          language={language}
          PreTag="div"
          codeTagProps={{ style: { fontSize: fontSizeBase } }}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: isMobile ? '2em' : '2.5em', 
            paddingRight: isMobile ? '0.5em' : '1em', 
            color: '#AAA',
            borderRight: '1px solid #E2E8F0',
            marginRight: isMobile ? '0.5em' : '1em',
            textAlign: 'right',
            userSelect: 'none',  // Prevent line number selection
            display: 'inline-block',  // Ensure block element is applied
            position: 'sticky',  // Fix position during scrolling
            left: 0,
            fontSize: fontSizeBase  // Apply same font size to line numbers
          }}
          wrapLines={true}
          wrapLongLines={false}
          lineProps={(lineNumber) => {
            // Check if line number should be highlighted
            // react-syntax-highlighter uses 0-based indexing, but markdown specifies line numbers starting from 1
            // No need to add 1 to lineNumber since highlightLines is already 1-indexed
            const highlight = highlightLines.includes(lineNumber);
            
            return {
              style: highlight ? highlightLineStyle : {},
              className: highlight ? 'highlighted-line' : undefined,
              'data-highlighted': highlight ? 'true' : 'false',
              'data-line-number': lineNumber,
            };
          }}
          customStyle={{
            margin: 0,
            padding: isMobile ? '0.8rem' : '1.25rem',
            background: '#f8fafc',
            borderRadius: 0,
            minWidth: 'max-content',
            fontSize: fontSizeBase,
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {value.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default SyntaxHighlighterClient; 