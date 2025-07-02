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
  const modalContentRef = useRef<HTMLDivElement>(null);
  
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
    setShowModal(prev => {
      const newState = !prev;
      if (newState) {
        // 모달이 열리면 body 스크롤 방지
        document.body.style.overflow = 'hidden';
        setSearchTerm(''); // 모달 열 때 검색어 초기화
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 10);
      } else {
        // 모달이 닫히면 body 스크롤 복원
        document.body.style.overflow = '';
      }
      return newState;
    });
  };
  
  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
    toggleModal(); // 카테고리 선택 후 모달 닫기
  };
  
  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 모달 외부 클릭 처리 (모달 배경 클릭 시 닫기)
  // 모달 내부 컨텐츠 클릭 시에는 닫히지 않도록 수정
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // modalContentRef.current가 존재하고, 클릭된 대상이 modalContentRef.current의 바깥 영역일 때만 모달을 닫음
      if (showModal && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        // 직접 .categoryModal을 클릭했는지 확인 (더 정확한 외부 클릭 감지)
        const modalElement = (event.target as HTMLElement).closest(`.${styles.categoryModal}`);
        if (modalElement && event.target === modalElement) {
          toggleModal();
        }
      }
    };
    
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // 컴포넌트 언마운트 시 body 스크롤 복원 (만약 모달이 열린 상태로 페이지 이동 등)
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    };
  }, [showModal]); // toggleModal을 의존성 배열에서 제거 (무한 루프 방지)
  
  return (
    <div className={styles.categorySelector}>
      <button 
        className={`${styles.categoryButton} ${showModal ? styles.modalOpen : ''}`}
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
        <div className={styles.categoryModal}>
          <div className={styles.modalContent} ref={modalContentRef}>
            <div className={styles.modalHeader}>
              <h3>Select Category</h3>
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
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
                  No categories found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 