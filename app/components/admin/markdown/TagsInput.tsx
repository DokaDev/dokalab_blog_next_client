'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './TagsInput.module.scss';

interface TagsInputProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
}

// 태그 자동완성을 위한 샘플 데이터
const sampleTags = [
  { id: 1, name: '#javascript', count: 15 },
  { id: 2, name: '#react', count: 12 },
  { id: 3, name: '#typescript', count: 8 },
  { id: 4, name: '#nextjs', count: 10 },
  { id: 5, name: '#webdev', count: 20 },
  { id: 6, name: '#frontend', count: 7 },
  { id: 7, name: '#backend', count: 5 },
  { id: 8, name: '#api', count: 3 },
  { id: 9, name: '#database', count: 9 },
  { id: 10, name: '#css', count: 11 },
];

export default function TagsInput({ initialTags = [], onChange }: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  // 필터링된 태그 자동완성 목록
  const filteredSuggestions = sampleTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !tags.includes(tag.name)
  );
  
  // 태그가 변경될 때 상위 컴포넌트에 알림
  useEffect(() => {
    if (onChange) {
      onChange(tags);
    }
  }, [tags, onChange]);
  
  // 태그 추가 함수
  const addTag = (tag: string) => {
    let newTag = tag.trim();
    
    // 입력값이 없으면 무시
    if (newTag === '') return;
    
    // # 접두사 자동 추가
    if (!newTag.startsWith('#')) {
      newTag = `#${newTag}`;
    }
    
    // 중복 태그 방지
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    
    // 입력란 초기화
    setInputValue('');
    setShowSuggestions(false);
    
    // 입력란에 포커스
    inputRef.current?.focus();
  };
  
  // 태그 제거 함수
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 입력값이 있을 때만 자동완성 표시
    setShowSuggestions(value !== '');
  };
  
  // 키보드 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키로 태그 추가
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
    
    // 백스페이스 키로 마지막 태그 제거 (입력값이 비어있을 때만)
    else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };
  
  // 자동완성 항목 클릭 핸들러
  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };
  
  // 태그 모달 열기
  const openTagsModal = () => {
    setShowModal(true);
  };
  
  // 태그 모달 닫기
  const closeTagsModal = () => {
    setShowModal(false);
  };
  
  // 모달 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);
  
  return (
    <div className={styles.tagsInputContainer}>
      <div className={styles.tagsHeader}>
        <h3>태그</h3>
        <button 
          className={styles.manageButton}
          onClick={openTagsModal}
          type="button"
        >
          태그 관리
        </button>
      </div>
      
      <div className={styles.tagsInput}>
        <div className={styles.selectedTags}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <span>{tag}</span>
              <button 
                type="button"
                className={styles.removeTag}
                onClick={() => removeTag(index)}
                aria-label={`Remove tag ${tag}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
          
          <input
            type="text"
            className={styles.tagInput}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "태그 추가..." : ""}
            ref={inputRef}
          />
        </div>
        
        {/* 태그 자동완성 */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={styles.suggestions} ref={suggestionRef}>
            {filteredSuggestions.map((tag) => (
              <div 
                key={tag.id} 
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(tag.name)}
              >
                <span className={styles.tagName}>{tag.name}</span>
                <span className={styles.tagCount}>{tag.count} posts</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.tagsInfo}>
        <p><kbd>Enter</kbd> 키를 눌러 태그를 추가하세요. 태그는 #으로 시작해야 합니다.</p>
      </div>
      
      {/* 태그 관리 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>태그 관리</h3>
              <button 
                className={styles.closeButton}
                onClick={closeTagsModal}
                aria-label="태그 관리 닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.tagsList}>
                <h4>모든 태그</h4>
                <div className={styles.allTags}>
                  {sampleTags.map((tag) => (
                    <div key={tag.id} className={styles.tagListItem}>
                      <span className={styles.tagName}>{tag.name}</span>
                      <span className={styles.tagCount}>{tag.count} 개의 글</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.selectedTagsList}>
                <h4>선택된 태그</h4>
                {tags.length > 0 ? (
                  <div className={styles.selectedTagsItems}>
                    {tags.map((tag, index) => (
                      <div key={index} className={styles.tagListItem}>
                        <span className={styles.tagName}>{tag}</span>
                        <button 
                          className={styles.removeTagButton}
                          onClick={() => removeTag(index)}
                          aria-label={`${tag} 태그 제거`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noTags}>선택된 태그가 없습니다</p>
                )}
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.doneButton}
                onClick={closeTagsModal}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 