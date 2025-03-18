'use client';

import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface SyntaxHighlighterClientProps {
  language: string;
  value: string;
}

const SyntaxHighlighterClient: React.FC<SyntaxHighlighterClientProps> = ({ language, value }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasOverflowX, setHasOverflowX] = useState(true); // 기본값을 true로 설정
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // 화면 크기 감지
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
    
    // 이전 타이머 취소
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }
    
    // 새 타이머 설정 (PC에서는 항상 표시되도록 모바일에서만 타이머 사용)
    if (isMobile) {
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // 스크롤 멈춘 후 1초 뒤에 스크롤바 숨김 (모바일에서만)
    }
  };
  
  // 마우스 호버 이벤트 핸들러
  const handleMouseEnter = () => {
    setIsScrolling(true);
  };
  
  // 마우스 아웃 이벤트 핸들러
  const handleMouseLeave = () => {
    // PC에서는 항상 표시되도록 모바일에서만 타이머 사용
    if (isMobile) {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    }
  };
  
  // 오버플로우 확인
  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // 컨테이너의 가로 스크롤이 필요한지 확인
        const hasOverflow = container.scrollWidth > container.clientWidth;
        
        // 디버깅용 정보
        console.log(`Code block overflow check: 
          scrollWidth: ${container.scrollWidth}, 
          clientWidth: ${container.clientWidth}, 
          hasOverflow: ${hasOverflow}`);
        
        // PC 환경에서는 항상 오버플로우가 있는 것으로 처리 (스크롤바 항상 표시)
        const forceOverflow = !isMobile || hasOverflow;
        setHasOverflowX(forceOverflow);
          
        // 직접 클래스 추가/제거하여 명시적으로 처리
        if (forceOverflow) {
          container.classList.add('has-overflow-x');
          // 데이터 속성도 설정
          container.setAttribute('data-has-overflow', 'true');
        } else {
          container.classList.remove('has-overflow-x');
          container.setAttribute('data-has-overflow', 'false');
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
  }, [isMobile]); // isMobile 의존성 추가

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

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      position: 'relative',
      width: '100%'
    }}>
      <div 
        ref={scrollContainerRef}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'block',
          width: '100%',
          msOverflowStyle: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
        className={`code-scroll-container ${isScrolling ? 'is-scrolling' : ''} ${hasOverflowX ? 'has-overflow-x' : ''}`}
        onScroll={handleScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-has-overflow={hasOverflowX ? 'true' : 'false'}
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