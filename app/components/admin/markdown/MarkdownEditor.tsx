'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import styles from './MarkdownEditor.module.scss';

// Dynamically import the Markdown renderer
const MarkdownRenderer = dynamic(() => import('@/app/components/markdown/MarkdownRenderer'), { 
  ssr: true 
});

interface MarkdownEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

interface ToolbarItem {
  label: string;
  icon: React.ReactNode;
  syntax: string;
  onClick?: () => void;
}

// Define CodeMirror ref type
interface CodeMirrorRef {
  view: EditorView;
}

export default function MarkdownEditor({ initialContent = '', onChange }: MarkdownEditorProps) {
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showToolbar, setShowToolbar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string, content: React.ReactNode }>({ title: '', content: null });
  
  const codeMirrorRef = useRef<CodeMirrorRef | null>(null);
  
  // CodeMirror extensions
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
  
  // useEffect for responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial setup
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fullscreen event handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Notify parent component whenever content changes
  useEffect(() => {
    if (onChange) {
      onChange(markdownContent);
    }
  }, [markdownContent, onChange]);
  
  const handleContentChange = (value: string) => {
    setMarkdownContent(value);
  };
  
  // Function to insert Markdown syntax
  const insertMarkdown = (syntax: string) => {
    const editor = codeMirrorRef.current;
    
    if (editor) {
      const { state, dispatch } = editor.view;
      const { from, to } = state.selection.main;
      const transaction = state.update({
        changes: { from, to, insert: syntax },
        selection: { anchor: from + syntax.length }
      });
      dispatch(transaction);
    } else {
      // Use existing logic if CodeMirror instance is not available
      setMarkdownContent(prevContent => prevContent + syntax);
    }
  };
  
  // Markdown syntax icon components
  const HeadingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h12"/>
      <path d="M6 20V4"/>
      <path d="M18 20V4"/>
    </svg>
  );
  
  const BoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 12a4 4 0 0 0 0-8H6v8"/>
      <path d="M15 20a4 4 0 0 0 0-8H6v8Z"/>
    </svg>
  );
  
  const ItalicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" x2="10" y1="4" y2="4"/>
      <line x1="14" x2="5" y1="20" y2="20"/>
      <line x1="15" x2="9" y1="4" y2="20"/>
    </svg>
  );
  
  const StrikethroughIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/>
      <path d="M8.5 8A4 4 0 0 1 19 8"/>
      <path d="M3 12h18"/>
    </svg>
  );
  
  const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6"/>
      <line x1="8" x2="21" y1="12" y2="12"/>
      <line x1="8" x2="21" y1="18" y2="18"/>
      <line x1="3" x2="3" y1="6" y2="6"/>
      <line x1="3" x2="3" y1="12" y2="12"/>
      <line x1="3" x2="3" y1="18" y2="18"/>
    </svg>
  );
  
  const NumberedListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" x2="21" y1="6" y2="6"/>
      <line x1="10" x2="21" y1="12" y2="12"/>
      <line x1="10" x2="21" y1="18" y2="18"/>
      <path d="M4 6h1v4"/>
      <path d="M4 10h2"/>
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
    </svg>
  );
  
  const QuoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  );
  
  const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
  
  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
  
  const TableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <line x1="3" x2="21" y1="9" y2="9"/>
      <line x1="3" x2="21" y1="15" y2="15"/>
      <line x1="9" x2="9" y1="3" y2="21"/>
      <line x1="15" x2="15" y1="3" y2="21"/>
    </svg>
  );
  
  const HorizontalRuleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" x2="21" y1="12" y2="12"/>
    </svg>
  );
  
  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
  
  const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
  
  const FullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
      <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
      <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
      <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
    </svg>
  );
  
  // Toolbar button list
  const toolbarItems: ToolbarItem[] = [
    { 
      label: 'Heading', 
      icon: <HeadingIcon />, 
      syntax: '# Heading 1\n', 
      onClick: () => {
        setModalContent({
          title: 'Headings',
          content: (
            <div className={styles.modalContent}>
              <p>In Markdown, use the <code>#</code> symbol to indicate headings. The number of <code>#</code> symbols determines the heading size.</p>
              <div className={styles.modalExample}>
                <div className={styles.modalCodeBlock}>
                  <pre>
                    <code>
                      # Heading 1<br/>
                      ## Heading 2<br/>
                      ### Heading 3<br/>
                      #### Heading 4<br/>
                      ###### Heading 5<br/>
                      ###### Heading 6
                    </code>
                  </pre>
                </div>
                <div className={styles.buttonGroup}>
                  <button onClick={() => insertMarkdown('# Heading 1\n')}>H1</button>
                  <button onClick={() => insertMarkdown('## Heading 2\n')}>H2</button>
                  <button onClick={() => insertMarkdown('### Heading 3\n')}>H3</button>
                  <button onClick={() => insertMarkdown('#### Heading 4\n')}>H4</button>
                  <button onClick={() => insertMarkdown('##### Heading 5\n')}>H5</button>
                  <button onClick={() => insertMarkdown('###### Heading 6\n')}>H6</button>
                </div>
              </div>
            </div>
          )
        });
        setShowModal(true);
      }
    },
    { 
      label: 'Bold', 
      icon: <BoldIcon />, 
      syntax: '**Bold Text**', 
      onClick: () => insertMarkdown('**Bold Text**') 
    },
    { 
      label: 'Italic', 
      icon: <ItalicIcon />, 
      syntax: '*Italic Text*', 
      onClick: () => insertMarkdown('*Italic Text*') 
    },
    { 
      label: 'Strikethrough', 
      icon: <StrikethroughIcon />, 
      syntax: '~~Strikethrough~~', 
      onClick: () => insertMarkdown('~~Strikethrough~~') 
    },
    { 
      label: 'List', 
      icon: <ListIcon />, 
      syntax: '\n- List item 1\n- List item 2\n- List item 3\n', 
      onClick: () => insertMarkdown('\n- List item 1\n- List item 2\n- List item 3\n') 
    },
    { 
      label: 'Numbered List', 
      icon: <NumberedListIcon />, 
      syntax: '\n1. First item\n2. Second item\n3. Third item\n', 
      onClick: () => insertMarkdown('\n1. First item\n2. Second item\n3. Third item\n') 
    },
    { 
      label: 'Quote', 
      icon: <QuoteIcon />, 
      syntax: '\n> Blockquote text\n', 
      onClick: () => insertMarkdown('\n> Blockquote text\n') 
    },
    { 
      label: 'Code', 
      icon: <CodeIcon />, 
      syntax: '\n```javascript\n// Your code here\n```\n', 
      onClick: () => insertMarkdown('\n```javascript\n// Your code here\n```\n') 
    },
    { 
      label: 'Link', 
      icon: <LinkIcon />, 
      syntax: '[Link text](https://example.com)', 
      onClick: () => insertMarkdown('[Link text](https://example.com)') 
    },
    { 
      label: 'Table', 
      icon: <TableIcon />, 
      syntax: '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', 
      onClick: () => insertMarkdown('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n') 
    },
    { 
      label: 'Horizontal Rule', 
      icon: <HorizontalRuleIcon />, 
      syntax: '\n---\n', 
      onClick: () => insertMarkdown('\n---\n') 
    },
    { 
      label: 'Image', 
      icon: <ImageIcon />, 
      syntax: '![Image Alt Text](https://example.com/image.jpg)', 
      onClick: () => {
        // Add image upload logic here
        insertMarkdown('![Image Alt Text](https://example.com/image.jpg)');
      } 
    },
    { 
      label: 'File', 
      icon: <FileIcon />, 
      syntax: '[Download File](https://example.com/file.pdf)', 
      onClick: () => {
        // Add file upload logic here
        insertMarkdown('[Download File](https://example.com/file.pdf)');
      } 
    },
    { 
      label: 'Fullscreen', 
      icon: <FullscreenIcon />, 
      syntax: '', 
      onClick: () => {
        const editorContainer = document.querySelector(`.${styles.editorContainer}`);
        if (!isFullscreen && editorContainer) {
          if (editorContainer.requestFullscreen) {
            editorContainer.requestFullscreen();
          }
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } 
    },
  ];
  
  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  return (
    <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* Toolbar toggle button in mobile environment */}
      {isMobile && (
        <button 
          className={styles.mobileToggle}
          onClick={() => setShowToolbar(!showToolbar)}
        >
          {showToolbar ? 'Hide Toolbar' : 'Show Toolbar'}
        </button>
      )}
      
      {/* Toolbar */}
      <div className={`${styles.toolbar} ${isMobile && !showToolbar ? styles.hidden : ''}`}>
        {toolbarItems.map((item, index) => (
          <div key={index} className={styles.tooltipWrapper}>
            <button
              className={styles.toolbarButton}
              onClick={item.onClick}
              aria-label={item.label}
              data-tooltip-id={`tooltip-${index}`}
            >
              {item.icon}
            </button>
            <span className={styles.tooltip} id={`tooltip-${index}`} role="tooltip">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Mobile tab controls */}
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
      
      {/* Editor content */}
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
            ref={codeMirrorRef}
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
      
      {/* Syntax help modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalContent.title}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 