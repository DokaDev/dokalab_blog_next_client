'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CategorySelector.module.scss';

interface CategorySelectorProps {
  initialCategory?: string;
  onChange?: (category: string) => void;
}

// 테스트용 카테고리 샘플 데이터
const sampleCategories = [
  { id: 1, name: 'Programming' },
  { id: 2, name: 'Web Development' },
  { id: 3, name: 'JavaScript' },
  { id: 4, name: 'React' },
  { id: 5, name: 'Node.js' },
  { id: 6, name: 'TypeScript' },
  { id: 7, name: 'Python' },
  { id: 8, name: 'DevOps' },
  { id: 9, name: 'Database' },
  { id: 10, name: 'Machine Learning' },
];

export default function CategorySelector({ initialCategory = 'No Category', onChange }: CategorySelectorProps) {
  const [category, setCategory] = useState(initialCategory);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 필터링된 카테고리 목록
  const filteredCategories = sampleCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 카테고리가 변경될 때 상위 컴포넌트에 알림
  useEffect(() => {
    if (onChange) {
      onChange(category);
    }
  }, [category, onChange]);
  
  // 모달 열기/닫기 핸들러
  const toggleModal = () => {
    setShowModal(prev => !prev);
    setSearchTerm('');
    
    // 모달이 열리면 검색 입력란에 포커스
    if (!showModal && searchInputRef.current) {
      // 안정적인 포커스를 위해 setTimeout 사용
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
    }
  };
  
  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
    setShowModal(false);
  };
  
  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 모달 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };
    
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);
  
  return (
    <div className={styles.categorySelector}>
      <button 
        className={styles.categoryButton}
        onClick={toggleModal}
        type="button"
      >
        <span className={category === 'No Category' ? styles.noCategory : ''}>
          {category}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      
      {/* 카테고리 선택 모달 */}
      {showModal && (
        <div className={styles.categoryModal} ref={modalRef}>
          <div className={styles.modalHeader}>
            <h3>카테고리 선택</h3>
            <button 
              className={styles.closeButton}
              onClick={toggleModal}
              aria-label="Close category selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div className={styles.categoriesList}>
            <div
              className={`${styles.categoryItem} ${category === 'No Category' ? styles.active : ''}`}
              onClick={() => handleCategorySelect('No Category')}
            >
              No Category
            </div>
            
            {filteredCategories.length > 0 ? (
              filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className={`${styles.categoryItem} ${category === cat.name ? styles.active : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  {cat.name}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                "{searchTerm}" 검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 