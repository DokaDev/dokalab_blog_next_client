'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

// Import the MarkdownRenderer component dynamically on the client side
const DynamicMarkdownRenderer = dynamic(() => import('../markdown/MarkdownRenderer'), {
  ssr: false,
});

// Client component for editor mode
export default function MarkdownRendererPage() {
  const [markdownContent, setMarkdownContent] = useState(`# Markdown Renderer Test

This is a test page for our custom markdown renderer component.

## Features:

- Syntax highlighting for code blocks
- Math equation rendering via KaTeX
- Support for tables and other markdown elements
`);

  const [outputContent, setOutputContent] = useState(markdownContent);
  const [showControls, setShowControls] = useState(true);

  // Development mode state (false shows output only, true shows input+output)
  const [isDevMode, setIsDevMode] = useState(true);

  const handlePreviewClick = () => {
    setOutputContent(markdownContent);
  };

  return (
    <div className={styles.markdownRendererContainer}>
      <div className={styles.header}>
        <h1>Markdown Renderer Test</h1>
        <div className={styles.controls}>
          {showControls && (
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isDevMode}
                onChange={() => setIsDevMode(!isDevMode)}
              />
              <span className={styles.slider}></span>
              <span className={styles.switchLabel}>
                {isDevMode ? 'Editor Mode' : 'Preview Mode'}
              </span>
            </label>
          )}
        </div>
      </div>

      <div className={isDevMode ? styles.splitView : styles.previewOnly}>
        {isDevMode && (
          <div className={styles.editorSection}>
            <h2>Editor</h2>
            <div className={styles.editorContainer}>
              <textarea
                className={styles.editor}
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
              />
              <button
                className={styles.previewButton}
                onClick={handlePreviewClick}
              >
                Preview
              </button>
            </div>
          </div>
        )}

        <div className={styles.previewSection}>
          <h2>Output</h2>
          <div className={styles.preview}>
            <DynamicMarkdownRenderer content={outputContent} />
          </div>
        </div>
      </div>

      {/* Developer mode toggle button */}
      <button
        className={styles.toggleControlsButton}
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>
    </div>
  );
} 