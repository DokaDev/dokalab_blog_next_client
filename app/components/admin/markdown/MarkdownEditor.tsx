'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './MarkdownEditor.module.scss';

// 마크다운 렌더러를 동적으로 가져옵니다
const MarkdownRenderer = dynamic(() => import('@/app/components/markdown/MarkdownRenderer'), { 
  ssr: true 
});

interface MarkdownEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export default function MarkdownEditor({ initialContent = '', onChange }: MarkdownEditorProps) {
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showToolbar, setShowToolbar] = useState(false);
  
  // 반응형 처리를 위한 useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 초기 설정
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 내용이 변경될 때마다 상위 컴포넌트에 알림
  useEffect(() => {
    if (onChange) {
      onChange(markdownContent);
    }
  }, [markdownContent, onChange]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value);
  };
  
  // 마크다운 문법 삽입 함수
  const insertMarkdown = (markdownSyntax: string) => {
    const textarea = document.querySelector(`.${styles.markdownInput}`) as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // 선택된 텍스트가 있는 경우와 없는 경우 처리
    if (start === end) {
      // 선택된 텍스트가 없는 경우
      const newText = `${text.substring(0, start)}${markdownSyntax}${text.substring(end)}`;
      setMarkdownContent(newText);
      
      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + markdownSyntax.length;
        textarea.selectionEnd = start + markdownSyntax.length;
      }, 0);
    } else {
      // 선택된 텍스트가 있는 경우, 마크다운 문법에 따라 처리
      // 이 부분은 실제 구현시 확장 필요
      const selectedText = text.substring(start, end);
      const newText = `${text.substring(0, start)}${markdownSyntax}${selectedText}${markdownSyntax}${text.substring(end)}`;
      setMarkdownContent(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + markdownSyntax.length;
        textarea.selectionEnd = end + markdownSyntax.length;
      }, 0);
    }
  };
  
  // 툴바 버튼 목록
  const toolbarItems = [
    { label: 'H1', syntax: '# ', onClick: () => insertMarkdown('# ') },
    { label: 'H2', syntax: '## ', onClick: () => insertMarkdown('## ') },
    { label: 'H3', syntax: '### ', onClick: () => insertMarkdown('### ') },
    { label: 'Bold', syntax: '**text**', onClick: () => insertMarkdown('**') },
    { label: 'Italic', syntax: '*text*', onClick: () => insertMarkdown('*') },
    { label: 'Link', syntax: '[text](url)', onClick: () => insertMarkdown('[](https://)') },
    { label: 'List', syntax: '- item', onClick: () => insertMarkdown('- ') },
    { label: 'Quote', syntax: '> text', onClick: () => insertMarkdown('> ') },
    { label: 'Code', syntax: '```code```', onClick: () => insertMarkdown('```\n\n```') },
    { label: 'Table', syntax: '| | |\n|--|--|\n| | |', onClick: () => insertMarkdown('| | |\n|--|--|\n| | |') },
  ];
  
  return (
    <div className={styles.editorContainer}>
      {/* 모바일 환경에서 툴바 토글 버튼 */}
      {isMobile && (
        <button 
          className={styles.mobileToggle}
          onClick={() => setShowToolbar(!showToolbar)}
        >
          {showToolbar ? 'Hide Toolbar' : 'Show Toolbar'}
        </button>
      )}
      
      {/* 툴바 */}
      <div className={`${styles.toolbar} ${isMobile && !showToolbar ? styles.hidden : ''}`}>
        <div className={styles.toolbarGroup}>
          {toolbarItems.slice(0, 3).map((item, index) => (
            <button
              key={index}
              className={styles.toolbarButton}
              onClick={item.onClick}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className={styles.toolbarGroup}>
          {toolbarItems.slice(3, 6).map((item, index) => (
            <button
              key={index}
              className={styles.toolbarButton}
              onClick={item.onClick}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className={styles.toolbarGroup}>
          {toolbarItems.slice(6).map((item, index) => (
            <button
              key={index}
              className={styles.toolbarButton}
              onClick={item.onClick}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 모바일 탭 컨트롤 */}
      {isMobile && (
        <div className={styles.tabControls}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'editor' ? styles.active : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'preview' ? styles.active : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
      )}
      
      {/* 에디터 내용 */}
      <div className={styles.editorContent}>
        <div 
          className={`${styles.editorPane} ${
            isMobile && activeTab !== 'editor' ? styles.hidden : ''
          }`}
        >
          <textarea
            value={markdownContent}
            onChange={handleContentChange}
            className={styles.markdownInput}
            placeholder="Write your markdown here..."
          />
        </div>
        
        <div 
          className={`${styles.previewPane} ${
            isMobile && activeTab !== 'preview' ? styles.hidden : ''
          }`}
        >
          <MarkdownRenderer content={markdownContent} />
        </div>
      </div>
    </div>
  );
} 