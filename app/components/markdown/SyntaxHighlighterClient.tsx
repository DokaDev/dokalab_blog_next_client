'use client';

import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface SyntaxHighlighterClientProps {
  language: string;
  value: string;
}

const SyntaxHighlighterClient: React.FC<SyntaxHighlighterClientProps> = ({ language, value }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // 기본값은 false로 변경
  const [hasOverflowX, setHasOverflowX] = useState(false); // 기본값을 false로 변경
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 화면 크기 감지
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // 데스크톱에서도 오버플로우 체크 필요 - checkOverflow 함수가 처리
    };
    
    // 초기 체크
    checkIfMobile();
    
    // 리사이즈 이벤트에 대응
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    setIsScrolling(true);
    
    // 스크롤 타이머 설정 - 모바일/데스크톱 모두 적용
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    scrollTimer.current = setTimeout(() => {
      // 데스크톱에서도 스크롤 중지 후에는 스크롤바 숨김 가능하게 수정
      setIsScrolling(false);
    }, isMobile ? 1000 : 2000); // 데스크톱에서는 더 오래 유지
  };
  
  // 마우스 호버 이벤트 핸들러
  const handleMouseEnter = () => {
    setIsScrolling(true);
  };
  
  // 마우스 아웃 이벤트 핸들러
  const handleMouseLeave = () => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    scrollTimer.current = setTimeout(() => {
      setIsScrolling(false);
    }, isMobile ? 300 : 1000); // 데스크톱에서는 더 오래 유지
  };
  
  // 오버플로우 확인
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // 컨테이너의 가로 스크롤이 필요한지 확인
        const hasOverflow = container.scrollWidth > container.clientWidth;
        
        // 디버깅용 정보
        // console.log(`Code block overflow check: 
        //   scrollWidth: ${container.scrollWidth}, 
        //   clientWidth: ${container.clientWidth}, 
        //   hasOverflow: ${hasOverflow},
        //   isMobile: ${isMobile}`);
        
        // 오버플로우가 있을 때만 true로 설정 (모바일/데스크톱 모두)
        setHasOverflowX(hasOverflow);
          
        // 직접 클래스 추가/제거하여 명시적으로 처리
        if (hasOverflow) {
          container.classList.add('has-overflow-x');
          container.setAttribute('data-has-overflow', 'true');
          
          // 오버플로우가 있고 데스크톱인 경우에만 스크롤 적용
          if (!isMobile) {
            container.style.overflowX = 'scroll';
            container.dataset.alwaysShowScrollbar = 'true';
            // 스크롤 있을 때 초기에 표시
            setIsScrolling(true);
            // 2초 후에 숨김 처리
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
          // 오버플로우 없을 때는 자동으로 설정
          container.style.overflowX = 'auto';
          container.dataset.alwaysShowScrollbar = 'false';
        }
      }
    };
    
    // 초기 로드 및 리사이즈 시 오버플로우 확인
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // 렌더링 이후에 여러번 체크 (코드가 완전히 렌더링 될때까지)
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
  }, [value, language, isMobile]); // 모바일 상태도 의존성에 추가
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      scrollContainer.addEventListener('mouseenter', handleMouseEnter);
      scrollContainer.addEventListener('mouseleave', handleMouseLeave);
      
      // 오버플로우가 있는 경우에만 스크롤 스타일 적용
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
  }, [isMobile, hasOverflowX]); // hasOverflowX 의존성 추가

  // 모바일과 데스크톱에 따라 다른 폰트 크기 적용
  const fontSizeBase = isMobile ? '0.8rem' : '0.9rem';

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
    }
  };

  // 데스크톱에서 스크롤바를 표시하기 위한 스타일 - 오버플로우가 있는 경우에만
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
          overflowX: hasOverflowX ? 'auto' : 'visible', // 오버플로우 있을 때만 스크롤 가능하게
          overflowY: 'hidden',
          display: 'block',
          width: '100%',
          msOverflowStyle: 'auto',
          WebkitOverflowScrolling: 'touch',
          // 오버플로우가 있는 경우에만 스크롤 스타일 적용
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
            textAlign: 'right'
          }}
          wrapLines={false}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: isMobile ? '0.8rem' : '1.25rem',
            background: '#f8fafc',
            borderRadius: 0,
            minWidth: 'max-content',
            fontSize: fontSizeBase,
          }}
        >
          {value.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default SyntaxHighlighterClient; 