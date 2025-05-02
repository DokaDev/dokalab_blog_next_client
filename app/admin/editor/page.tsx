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
  const exampleMarkdown = `# 마크다운 에디터에 오신 것을 환영합니다

이것은 마크다운 에디터 작동 방식의 간단한 예시입니다.

## 기능

- **굵은 텍스트**와 *기울임 텍스트*
- 목록 (순서 있는 목록과 없는 목록)
- [링크](https://example.com)
- 코드 블록:

\`\`\`javascript
function hello() {
  console.log("안녕하세요");
}
\`\`\`

> 인용구도 지원됩니다

마크다운으로 즐겁게 작성하세요!
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
      alert(titleError || '제목을 올바르게 입력해주세요.');
      return;
    }
    
    if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }
    
    console.log({
      title,
      category,
      tags,
      markdownContent
    });
    
    alert('글이 저장되었습니다! (임시 알림)');
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
            저장하기
          </button>
        </div>
      </div>
    </main>
  );
} 