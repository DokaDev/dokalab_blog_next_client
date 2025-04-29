'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
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
  
  // CodeMirror 확장 기능
  const extensions: Extension[] = [
    markdown({ 
      base: markdownLanguage, 
      codeLanguages: languages,
      addKeymap: true
    }),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': {
        height: '100%',
        minHeight: '500px',
        fontSize: '14px',
        fontFamily: 'Menlo, Monaco, Consolas, monospace'
      },
      '.cm-scroller': { overflow: 'auto' },
      '.cm-content': { minHeight: '500px' },
      '.cm-gutters': { background: '#f8fafc', borderRight: '1px solid #e2e8f0' },
      '.cm-lineNumbers': { color: '#94a3b8' },
      '.cm-activeLineGutter': { backgroundColor: '#f1f5f9' }
    })
  ];
  
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
  
  const handleContentChange = (value: string) => {
    setMarkdownContent(value);
  };
  
  // 마크다운 문법 삽입 함수
  const insertMarkdown = (markdownSyntax: string) => {
    // CodeMirror를 직접 제어할 수 없으므로 현재 상태를 기반으로 새 콘텐츠 생성
    setMarkdownContent(prevContent => {
      // 매우 기본적인 구현 - 실제로는 커서 위치를 고려해야 함
      return prevContent + markdownSyntax;
    });
  };
  
  // 툴바 버튼 목록
  const toolbarItems = [
    { label: 'H1', syntax: '# Heading 1\n', onClick: () => insertMarkdown('# Heading 1\n') },
    { label: 'H2', syntax: '## Heading 2\n', onClick: () => insertMarkdown('## Heading 2\n') },
    { label: 'H3', syntax: '### Heading 3\n', onClick: () => insertMarkdown('### Heading 3\n') },
    { label: 'Bold', syntax: '**Bold text**', onClick: () => insertMarkdown('**Bold text**') },
    { label: 'Italic', syntax: '*Italic text*', onClick: () => insertMarkdown('*Italic text*') },
    { label: 'Link', syntax: '[Link text](https://example.com)', onClick: () => insertMarkdown('[Link text](https://example.com)') },
    { label: 'List', syntax: '\n- List item\n', onClick: () => insertMarkdown('\n- List item\n') },
    { label: 'Quote', syntax: '\n> Blockquote\n', onClick: () => insertMarkdown('\n> Blockquote\n') },
    { label: 'Code', syntax: '\n```javascript\n// Your code here\n```\n', onClick: () => insertMarkdown('\n```javascript\n// Your code here\n```\n') },
    { label: 'Table', syntax: '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', onClick: () => insertMarkdown('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n') },
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
          <CodeMirror
            value={markdownContent}
            extensions={extensions}
            onChange={handleContentChange}
            placeholder="Write your markdown here..."
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              bracketMatching: true,
              autocompletion: true
            }}
            className={styles.codeMirrorWrapper}
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