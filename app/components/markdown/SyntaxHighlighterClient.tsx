'use client';

import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface SyntaxHighlighterClientProps {
  language: string;
  value: string;
  highlightLines?: number[];
}

const SyntaxHighlighterClient: React.FC<SyntaxHighlighterClientProps> = ({ 
  language, 
  value,
  highlightLines = []
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasOverflowX, setHasOverflowX] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect screen size and set mobile state
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Desktop also needs overflow check - this is handled by the checkOverflow function
    };
    
    // Initial check on component mount
    checkIfMobile();
    
    // Add resize event listener to respond to viewport changes
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Handle scroll events for scrollbar visibility
  const handleScroll = () => {
    setIsScrolling(true);
    
    // Set scroll timer for both mobile and desktop environments
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    scrollTimer.current = setTimeout(() => {
      // Hide scrollbar after timeout on both desktop and mobile
      setIsScrolling(false);
    }, isMobile ? 1000 : 2000); // Longer timeout for desktop for better UX
  };
  
  // Handle mouse enter events for scrollbar visibility
  const handleMouseEnter = () => {
    setIsScrolling(true);
  };
  
  // Handle mouse leave events
  const handleMouseLeave = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, isMobile ? 300 : 1000); // Longer timeout for desktop for better UX
  };
  
  // Check if container has overflow and update UI accordingly
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // Check if horizontal scrolling is needed (content width > container width)
        const hasOverflow = container.scrollWidth > container.clientWidth;
        
        // Only set to true when overflow exists (applies to both mobile and desktop)
        setHasOverflowX(hasOverflow);
          
        // Directly add/remove classes for explicit handling
        if (hasOverflow) {
          container.classList.add('has-overflow-x');
          container.setAttribute('data-has-overflow', 'true');
          
          // Apply scrolling only on desktop with overflow
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
          // Use auto overflow when no overflow exists
          container.style.overflowX = 'auto';
          container.dataset.alwaysShowScrollbar = 'false';
        }
      }
    };
    
    // Check overflow on initial load and window resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Check multiple times to ensure code is fully rendered
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
      
      // Only apply scroll style when overflow exists
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
  }, [isMobile, hasOverflowX, handleScroll, handleMouseLeave]); // Include handler dependencies for React hooks compliance

  // Set font size in pixels for consistency across devices
  const fontSizeBase = '14px'; // Fixed pixel size for better control

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
    // SyntaxHighlighter internal styles are removed - using global CSS instead
  };
  
  // Define highlight line style - add class name only, styles handled in globals.css
  const highlightLineStyle = {
    backgroundColor: 'rgba(100, 74, 201, 0.15)', // Keep base background color only
    fontWeight: 600 // Make highlighted text bold
  };

  // Desktop scrollbar display style - only applied when overflow exists
  const desktopScrollStyle = !isMobile && hasOverflowX ? {
    overflowX: 'scroll' as const,
    msOverflowStyle: 'scrollbar' as const,
    WebkitOverflowScrolling: 'touch' as const,
  } : {};

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      position: 'relative',
      width: '100%'
    }}>
      <div 
        ref={scrollContainerRef}
        style={{
          overflowX: hasOverflowX ? 'auto' : 'visible', // Only enable scrolling when overflow exists
          overflowY: 'hidden',
          display: 'block',
          width: '100%',
          msOverflowStyle: 'auto',
          WebkitOverflowScrolling: 'touch',
          // Apply scroll style only when overflow exists
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
            display: 'inline-block',  // Ensure block element is properly applied
            position: 'sticky',  // Fix position during scrolling
            left: 0,
            fontSize: fontSizeBase  // Use same font size for line numbers
          }}
          wrapLines={true}
          wrapLongLines={false}
          lineProps={(lineNumber) => {
            // Check if line number should be highlighted
            // react-syntax-highlighter uses 0-based indexing, but markdown uses 1-based line numbers
            // Compare directly since highlightLines is already 1-indexed
            const highlight = highlightLines.includes(lineNumber);
            
            return {
              style: highlight ? highlightLineStyle : {},
              className: highlight ? 'highlighted-line' : undefined,
              'data-highlighted': highlight ? 'true' : 'false',
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