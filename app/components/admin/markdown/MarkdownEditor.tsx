'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Extension } from '@codemirror/state';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import styles from './MarkdownEditor.module.scss';

// Dynamically import CodeMirror to reduce initial bundle size
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading editor...</p>
    </div>
  )
});

// Dynamically import the Markdown renderer
const MarkdownRenderer = dynamic(() => import('@/app/components/markdown/MarkdownRenderer'), {
  ssr: false,
  loading: () => (
    <div className={styles.previewLoading}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading preview...</p>
    </div>
  )
});

interface MarkdownEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

// CodeMirror ref is now properly typed with ReactCodeMirrorRef

export default function MarkdownEditor({ initialContent = '', onChange }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string, content: React.ReactNode }>({ title: '', content: null });
  
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  
  // Load CodeMirror extensions
  useEffect(() => {
    const loadExtensions = async () => {
      try {
        const { createMarkdownExtensions } = await import('./CodeMirrorExtensions');
        const extensionList = await createMarkdownExtensions();
        setExtensions(extensionList);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load editor extensions:', error);
        setIsLoading(false);
      }
    };

    loadExtensions();
  }, []);
  
  // useEffect for responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle onChange side effect
  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content, onChange]);
  
  const handleContentChange = (value: string) => {
    setContent(value);
  };
  
  // Function to insert Markdown syntax
  const insertMarkdown = (syntax: string) => {
    const editor = editorRef.current;
    
    if (editor?.view) {
      const view = editor.view;
      const { from, to } = view.state.selection.main;
      const transaction = view.state.update({
        changes: { from, to, insert: syntax },
        selection: { anchor: from + syntax.length }
      });
      view.dispatch(transaction);
    } else {
      // Use existing logic if CodeMirror instance is not available
      setContent(prevContent => prevContent + syntax);
    }
  };

  // Add helper functions for toolbar actions
  const insertBold = () => insertMarkdown('**bold text**');
  const insertItalic = () => insertMarkdown('*italic text*');
  const insertCode = () => insertMarkdown('`code`');
  const insertLink = () => insertMarkdown('[link text](https://example.com)');
  const insertImage = () => insertMarkdown('![alt text](image-url)');
  const insertHeader = () => insertMarkdown('## Header');
  const insertList = () => insertMarkdown('\n- List item');
  const insertTable = () => insertMarkdown('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |');
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const showHelp = () => {
    setModalContent({
      title: 'Markdown Help',
      content: (
        <div>
          <h4>Basic Syntax</h4>
          <ul>
            <li><strong>Bold:</strong> **text** or __text__</li>
            <li><strong>Italic:</strong> *text* or _text_</li>
            <li><strong>Code:</strong> `code`</li>
            <li><strong>Link:</strong> [text](url)</li>
            <li><strong>Image:</strong> ![alt](url)</li>
            <li><strong>Header:</strong> # H1, ## H2, ### H3</li>
            <li><strong>List:</strong> - item or 1. item</li>
          </ul>
        </div>
      )
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Show loading state while extensions are loading
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.editorLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Initializing editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button onClick={insertBold} className={styles.toolbarButton} title="Bold">
            <strong>B</strong>
          </button>
          <button onClick={insertItalic} className={styles.toolbarButton} title="Italic">
            <em>I</em>
          </button>
          <button onClick={insertCode} className={styles.toolbarButton} title="Code">
            {'<>'}
          </button>
          <button onClick={insertLink} className={styles.toolbarButton} title="Link">
            🔗
          </button>
          <button onClick={insertImage} className={styles.toolbarButton} title="Image">
            🖼️
          </button>
          <button onClick={insertHeader} className={styles.toolbarButton} title="Header">
            H
          </button>
          <button onClick={insertList} className={styles.toolbarButton} title="List">
            📝
          </button>
          <button onClick={insertTable} className={styles.toolbarButton} title="Table">
            📊
          </button>
        </div>
        
        <div className={styles.toolbarGroup}>
          <button onClick={showHelp} className={styles.toolbarButton} title="Help">
            ❓
          </button>
          <button onClick={toggleFullscreen} className={styles.toolbarButton} title="Fullscreen">
            {isFullscreen ? '🗗' : '🗖'}
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      {isMobile && (
        <div className={styles.tabSwitcher}>
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

      {/* Editor layout */}
      <div className={styles.editorLayout}>
        {/* Editor Panel */}
        <div 
          className={`${styles.editorPanel} ${
            isMobile ? (activeTab === 'editor' ? styles.active : styles.hidden) : ''
          }`}
        >
          <CodeMirror
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            extensions={extensions}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: true,
              searchKeymap: true,
            }}
            placeholder="Write your markdown here..."
          />
        </div>

        {/* Preview Panel */}
        <div 
          className={`${styles.previewPanel} ${
            isMobile ? (activeTab === 'preview' ? styles.active : styles.hidden) : ''
          }`}
        >
          <MarkdownRenderer content={content} />
        </div>
      </div>

      {/* Help Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalContent.title}</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 