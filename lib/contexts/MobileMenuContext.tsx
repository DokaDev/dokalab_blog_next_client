'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Mobile Menu Context
 * 
 * Provides global state management for mobile menu open/close functionality.
 * This allows the Header component and Navigation component to share menu state
 * without prop drilling and enables better separation of concerns.
 * 
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * <MobileMenuProvider>
 *   <Header />
 *   <Navigation />
 * </MobileMenuProvider>
 * 
 * // Use the hook in components
 * const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();
 * ```
 */

interface MobileMenuContextType {
  /** Current state of the mobile menu (open/closed) */
  isMobileMenuOpen: boolean;
  /** Toggle mobile menu between open and closed states */
  toggleMobileMenu: () => void;
  /** Close the mobile menu */
  closeMobileMenu: () => void;
  /** Set mobile menu to specific state (open/closed) */
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

/**
 * Hook to access mobile menu context
 * 
 * @throws {Error} If used outside of MobileMenuProvider
 * @returns {MobileMenuContextType} Mobile menu state and actions
 */
export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
};

interface MobileMenuProviderProps {
  children: ReactNode;
}

/**
 * Provider component for mobile menu context
 * 
 * Manages the global state for mobile menu functionality and provides
 * optimized actions using useCallback to prevent unnecessary re-renders.
 * 
 * @param {MobileMenuProviderProps} props - Provider props
 * @returns {JSX.Element} Provider component
 */
export const MobileMenuProvider: React.FC<MobileMenuProviderProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoize callbacks to prevent unnecessary re-renders of consuming components
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const setMobileMenuOpen = useCallback((isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
  }, []);

  const value = {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    setMobileMenuOpen,
  };

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
    </MobileMenuContext.Provider>
  );
}; 