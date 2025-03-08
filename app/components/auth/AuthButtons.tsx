"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getRemainingTime } from '@/app/lib/auth';
import styles from './AuthButtons.module.scss';

export function AuthButtons() {
  const { user, isAuthenticated, loading, login, logout, tokens } = useAuth();
  const [email, setEmail] = useState('test@example.com'); // Default value for testing
  const [password, setPassword] = useState('password'); // Default value for testing
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessRemaining, setAccessRemaining] = useState<number>(0);
  const [refreshRemaining, setRefreshRemaining] = useState<number>(0);
  
  // Update token remaining times
  useEffect(() => {
    if (!tokens) return;
    
    const updateTokenTimes = () => {
      if (tokens?.accessToken) {
        setAccessRemaining(getRemainingTime(tokens.accessToken));
      }
      if (tokens?.refreshToken) {
        setRefreshRemaining(getRemainingTime(tokens.refreshToken));
      }
    };
    
    // Update immediately
    updateTokenTimes();
    
    // Update every second
    const interval = setInterval(updateTokenTimes, 1000);
    
    return () => clearInterval(interval);
  }, [tokens]);
  
  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
    } catch {
      setError('Login failed. Please check your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (loading) {
    return <div className={styles.authButtons}>Loading...</div>;
  }
  
  if (isAuthenticated && user) {
    return (
      <div className={styles.authButtons}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userEmail}>({user.email})</span>
        </div>
        
        <div className={styles.tokenInfo}>
          <div className={styles.tokenStatus}>
            <span>Access Token: </span>
            <span className={accessRemaining > 0 ? styles.valid : styles.expired}>
              {accessRemaining > 0 ? `${accessRemaining}s remaining` : 'Expired'}
            </span>
          </div>
          <div className={styles.tokenStatus}>
            <span>Refresh Token: </span>
            <span className={refreshRemaining > 0 ? styles.valid : styles.expired}>
              {refreshRemaining > 0 ? `${refreshRemaining}s remaining` : 'Expired'}
            </span>
          </div>
        </div>
        
        <button 
          className={styles.logoutButton} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.authButtons}>
      <div className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
} 