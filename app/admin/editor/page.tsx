'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [titleError, setTitleError] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(true);
  
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
  
  // 타이틀 유효성 검사 핸들러
  const handleTitleValidation = (isValid: boolean, errorMessage: string) => {
    setIsTitleValid(isValid);
    setTitleError(errorMessage);
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
    // 제목 유효성 검사
    if (!isTitleValid) {
      alert(titleError || 'Please enter a valid title.');
      return;
    }
    
    if (title.trim() === '') {
      alert('Title cannot be empty.');
      return;
    }
    
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
      <div className={styles.editorForm}>
        <div className={styles.titleSection}>
          <TitleInput 
            initialTitle={title}
            onChange={handleTitleChange}
            onValidate={handleTitleValidation}
          />
          <div className={styles.categoryWrapper}>
            <CategorySelector 
              initialCategory={category}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
        
        <MarkdownEditor 
          initialContent={markdownContent}
          onChange={handleMarkdownChange}
        />
        
        <div className={styles.footerSection}>
          <TagsInput 
            initialTags={tags}
            onChange={handleTagsChange}
          />
          
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save Post
          </button>
        </div>
      </div>
    </main>
  );
} 