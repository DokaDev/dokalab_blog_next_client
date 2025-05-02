'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import MarkdownEditor from '@/app/components/admin/markdown/MarkdownEditor';
import TitleInput from '@/app/components/admin/markdown/TitleInput';
import CategorySelector from '@/app/components/admin/markdown/CategorySelector';
import TagsInput from '@/app/components/admin/markdown/TagsInput';

export default function MarkdownEditorPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('No Category');
  const [tags, setTags] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  
  // 마크다운 예시 콘텐츠
  const exampleMarkdown = `# Welcome to Markdown Editor

This is a simple example of how the markdown editor works.

## Features

- **Bold text** and *italic text*
- Lists (ordered and unordered)
- [Links](https://example.com)
- Code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

> Blockquotes are also supported

Enjoy writing with markdown!
`;

  // 초기 마크다운 콘텐츠 설정
  useEffect(() => {
    setMarkdownContent(exampleMarkdown);
  }, []);
  
  // 변경 감지
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDirty(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [title, category, tags, markdownContent]);
  
  // 타이틀 변경 핸들러
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };
  
  // 카테고리 변경 핸들러
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };
  
  // 태그 변경 핸들러
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };
  
  // 마크다운 콘텐츠 변경 핸들러
  const handleMarkdownChange = (content: string) => {
    setMarkdownContent(content);
  };
  
  // 저장 핸들러 (현재는 콘솔에 출력만)
  const handleSave = () => {
    console.log({
      title,
      category,
      tags,
      markdownContent
    });
    
    alert('Post saved successfully! (This is a placeholder)');
    setIsDirty(false);
  };
  
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        
        <h1 className={styles.title}>Markdown Editor</h1>
        
        <div className={styles.actions}>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save Post
          </button>
        </div>
      </div>
      
      <div className={styles.editorForm}>
        <div className={styles.metadataSection}>
          <TitleInput 
            initialTitle={title}
            onChange={handleTitleChange}
          />
          
          <div className={styles.metadataColumns}>
            <CategorySelector 
              initialCategory={category}
              onChange={handleCategoryChange}
            />
            
            <TagsInput 
              initialTags={tags}
              onChange={handleTagsChange}
            />
          </div>
        </div>
        
        <MarkdownEditor 
          initialContent={markdownContent}
          onChange={handleMarkdownChange}
        />
      </div>
    </main>
  );
} 