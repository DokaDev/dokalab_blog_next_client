"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens } from '@/app/types/auth';
import { loginTest, verifyJwt, decodeJwt, refreshTestToken, getRemainingTime } from '@/app/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  tokens: AuthTokens | null;
  setTokens: (tokens: AuthTokens) => void;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  tokens: null,
  setTokens: () => {}
};

// Create auth context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Local storage keys (for testing)
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

// Token refresh interval (in milliseconds)
const TOKEN_REFRESH_INTERVAL = 15 * 1000; // 15 seconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 토큰 상태 업데이트 및 저장 함수 (외부에서 호출 가능)
  const updateTokens = (newTokens: AuthTokens) => {
    console.log('[AUTH] Updating tokens in context');
    setTokens(newTokens);
    
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
    
    // 토큰에서 사용자 정보 추출
    try {
      const payload = decodeJwt(newTokens.accessToken);
      const userData: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role
      };
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('[AUTH] Error decoding token:', error);
    }
  };
  
  // Log token status
  const logTokenStatus = (accessToken: string | null, refreshToken: string | null) => {
    console.log('[TOKEN_STATUS] Checking tokens...');
    
    if (!accessToken) {
      console.log('[TOKEN_STATUS] No access token found');
    } else {
      const accessRemaining = getRemainingTime(accessToken);
      console.log(`[TOKEN_STATUS] Access Token: ${accessRemaining} seconds remaining`);
    }
    
    if (!refreshToken) {
      console.log('[TOKEN_STATUS] No refresh token found');
    } else {
      const refreshRemaining = getRemainingTime(refreshToken);
      console.log(`[TOKEN_STATUS] Refresh Token: ${refreshRemaining} seconds remaining`);
    }
  };
  
  // Load tokens and user info from local storage (for testing)
  const loadAuthState = () => {
    console.log('[AUTH] Loading authentication state');
    
    if (typeof window !== 'undefined') {
      try {
        // Verify access token
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        
        console.log('[AUTH] Tokens from storage:', accessToken ? 'Access token found' : 'No access token', refreshToken ? 'Refresh token found' : 'No refresh token');
        logTokenStatus(accessToken, refreshToken);
        
        if (accessToken && verifyJwt(accessToken) && savedUser) {
          // Set user info if access token is valid
          console.log('[AUTH] Access token is valid, setting user state');
          setTokens({ 
            accessToken, 
            refreshToken: refreshToken || '' 
          });
          setUser(JSON.parse(savedUser));
          return true;
        } else if (refreshToken && verifyJwt(refreshToken)) {
          // Refresh token if access token is expired but refresh token is valid
          console.log('[AUTH] Access token invalid/expired but refresh token valid, refreshing tokens');
          refreshTokens(refreshToken);
          return true;
        }
        
        console.log('[AUTH] No valid tokens found');
      } catch (error) {
        console.error('[AUTH] Failed to load auth state:', error);
      }
    }
    return false;
  };
  
  // Token refresh function
  const refreshTokens = async (refreshToken: string) => {
    console.log('[AUTH] Starting token refresh process');
    try {
      const newTokens = await refreshTestToken(refreshToken);
      console.log('[AUTH] Token refresh successful');
      updateTokens(newTokens);
      return true;
    } catch (error) {
      console.error('[AUTH] Failed to refresh token:', error);
      clearAuthState();
      return false;
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    console.log('[AUTH] Login attempt initiated');
    setLoading(true);
    try {
      // Call test login function
      const { tokens: authTokens } = await loginTest({ email, password });
      
      // Update state using the new function
      updateTokens(authTokens);
      console.log('[AUTH] User state updated after login');
    } catch (error) {
      console.error('[AUTH] Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    console.log('[AUTH] Logout initiated');
    clearAuthState();
  };
  
  // Clear auth state
  const clearAuthState = () => {
    console.log('[AUTH] Clearing authentication state');
    setUser(null);
    setTokens(null);
    
    // Remove from local storage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('[AUTH] All tokens removed from storage');
  };
  
  // Check token status periodically
  const checkTokenStatus = () => {
    if (tokens?.accessToken) {
      console.log('[TOKEN_CHECK] Periodic token status check');
      logTokenStatus(tokens.accessToken, tokens.refreshToken);
      
      // Auto-refresh if access token is about to expire (less than 10 seconds remaining)
      const accessRemaining = getRemainingTime(tokens.accessToken);
      if (accessRemaining < 10 && tokens.refreshToken) {
        console.log('[TOKEN_CHECK] Access token expiring soon, attempting refresh');
        refreshTokens(tokens.refreshToken);
      }
    }
  };
  
  // Load auth state on component mount
  useEffect(() => {
    console.log('[AUTH] Auth provider initialized');
    const isAuthenticated = loadAuthState();
    setLoading(false);
    
    // Set up token refresh timer (check every 15 seconds for testing)
    let refreshInterval: NodeJS.Timeout | null = null;
    if (isAuthenticated) {
      console.log(`[AUTH] Setting up token check interval (${TOKEN_REFRESH_INTERVAL/1000}s)`);
      refreshInterval = setInterval(checkTokenStatus, TOKEN_REFRESH_INTERVAL);
    }
    
    return () => {
      if (refreshInterval) {
        console.log('[AUTH] Clearing token check interval');
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  // Context value to provide
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    tokens,
    setTokens: updateTokens
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 