'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import MarkdownEditor from '@/app/components/admin/markdown/MarkdownEditor';
import TitleInput from '@/app/components/admin/markdown/TitleInput';
import CategorySelector from '@/app/components/admin/markdown/CategorySelector';
import TagsInput from '@/app/components/admin/markdown/TagsInput';
import ErrorModal from '@/app/components/common/ErrorModal';

export default function MarkdownEditorPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('No Category');
  const [tags, setTags] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [titleValidationError, setTitleValidationError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModalTitle, setErrorModalTitle] = useState('Validation Error');
  
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
  }, [exampleMarkdown]);
  
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
  const handleTitleValidation = (isValid: boolean, validationMessage: string) => {
    setIsTitleValid(isValid);
    setTitleValidationError(validationMessage);
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
      setErrorModalTitle('Invalid Title');
      setErrorMessage(titleValidationError || 'Please enter a valid title (1-255 characters).');
      setShowErrorModal(true);
      return;
    }
    
    if (title.trim() === '') {
      setErrorModalTitle('Title Required');
      setErrorMessage('Title cannot be empty. Please enter a title.');
      setShowErrorModal(true);
      return;
    }
    
    // 카테고리 유효성 검사
    if (category === 'No Category') {
      setErrorModalTitle('Category Required');
      setErrorMessage('Please select a category for the post.');
      setShowErrorModal(true);
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

      <ErrorModal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalTitle}
        message={errorMessage}
      />
    </main>
  );
} 