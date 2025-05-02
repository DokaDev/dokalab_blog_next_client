'use client';

import { useState, useEffect } from 'react';
import styles from './TitleInput.module.scss';

interface TitleInputProps {
  initialTitle?: string;
  onChange?: (title: string) => void;
}

export default function TitleInput({ initialTitle = '', onChange }: TitleInputProps) {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  
  // 제목이 변경될 때 상위 컴포넌트에 알림
  useEffect(() => {
    if (onChange) {
      onChange(title);
    }
    
    // 실시간 유효성 검사를 위한 로직 (선택적)
    validateTitle(title, false);
  }, [title, onChange]);
  
  // 제목 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  // 제목 유효성 검사
  const validateTitle = (value: string, showErrorMessage = true) => {
    if (value.trim() === '') {
      setError('Title cannot be empty');
      if (showErrorMessage) setShowError(true);
      return false;
    }
    
    if (value.length > 255) {
      setError('Title must be 255 characters or less');
      if (showErrorMessage) setShowError(true);
      return false;
    }
    
    setError('');
    return true;
  };
  
  // 포커스를 잃었을 때 유효성 검사
  const handleBlur = () => {
    validateTitle(title, true);
  };
  
  // 에러 모달 닫기
  const handleCloseError = () => {
    setShowError(false);
  };
  
  return (
    <div className={styles.titleInputContainer}>
      <input
        type="text"
        className={`${styles.titleInput} ${error ? styles.hasError : ''}`}
        value={title}
        onChange={handleTitleChange}
        onBlur={handleBlur}
        placeholder="Enter post title..."
        aria-label="Post title"
        maxLength={255}
      />
      
      {/* 제목 길이 카운터 */}
      <div className={styles.titleCounter}>
        <span className={title.length > 200 ? styles.warningCount : ''}>
          {title.length}
        </span> / 255
      </div>
      
      {/* 에러 모달 */}
      {showError && error && (
        <div className={styles.errorModal}>
          <div className={styles.errorModalContent}>
            <div className={styles.errorModalHeader}>
              <h4>Error</h4>
              <button 
                className={styles.closeButton}
                onClick={handleCloseError}
                aria-label="Close error message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className={styles.errorMessage}>
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 