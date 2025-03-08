"use client";

import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ApiEndpoint, callTestApi, ApiResponse } from '@/app/lib/apiTest';
import styles from './ApiTestButtons.module.scss';

export function ApiTestButtons() {
  const { tokens, isAuthenticated, setTokens } = useAuth();
  const [loading, setLoading] = useState<ApiEndpoint | null>(null);
  const [results, setResults] = useState<{ [key in ApiEndpoint]?: ApiResponse }>({});

  // API 호출 테스트 함수
  const handleApiCall = async (endpoint: ApiEndpoint) => {
    setLoading(endpoint);
    try {
      const response = await callTestApi(
        endpoint,
        tokens?.accessToken,
        tokens?.refreshToken
      );
      setResults((prev) => ({
        ...prev,
        [endpoint]: response
      }));
      
      // 토큰이 갱신되었으면 AuthContext 업데이트
      if (response.tokenRefreshed && response.newTokens) {
        console.log('[UI] Tokens were refreshed during API call, updating context');
        setTokens(response.newTokens);
      }
      
    } catch {
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: 'Unexpected error occurred'
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  // 결과 리셋
  const resetResults = () => {
    setResults({});
  };

  return (
    <div className={styles.apiTestContainer}>
      <h2 className={styles.title}>API Request Test</h2>
      
      <div className={styles.description}>
        <p>Test different API endpoints with JWT authentication:</p>
        <ul>
          <li><strong>Public API</strong>: No authentication required</li>
          <li><strong>Protected API</strong>: Valid JWT required</li>
          <li><strong>Admin API</strong>: JWT with admin role required (50% chance of success)</li>
        </ul>
      </div>
      
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.apiButton} ${styles.public}`}
          onClick={() => handleApiCall(ApiEndpoint.PUBLIC)}
          disabled={loading !== null}
        >
          {loading === ApiEndpoint.PUBLIC ? 'Calling...' : 'Call Public API'}
        </button>
        
        <button
          className={`${styles.apiButton} ${styles.protected}`}
          onClick={() => handleApiCall(ApiEndpoint.PROTECTED)}
          disabled={loading !== null}
        >
          {loading === ApiEndpoint.PROTECTED ? 'Calling...' : 'Call Protected API'}
        </button>
        
        <button
          className={`${styles.apiButton} ${styles.admin}`}
          onClick={() => handleApiCall(ApiEndpoint.ADMIN)}
          disabled={loading !== null}
        >
          {loading === ApiEndpoint.ADMIN ? 'Calling...' : 'Call Admin API'}
        </button>
        
        <button
          className={styles.resetButton}
          onClick={resetResults}
          disabled={loading !== null || Object.keys(results).length === 0}
        >
          Clear Results
        </button>
      </div>
      
      {!isAuthenticated && (
        <div className={styles.warning}>
          <p>You are not logged in. Protected endpoints will fail.</p>
        </div>
      )}
      
      {Object.keys(results).length > 0 && (
        <div className={styles.resultsContainer}>
          <h3>API Call Results</h3>
          
          {Object.entries(results).map(([endpoint, response]) => (
            <div 
              key={endpoint} 
              className={`${styles.resultCard} ${response.success ? styles.success : styles.error}`}
            >
              <h4>{endpoint} Endpoint</h4>
              
              {response.tokenRefreshed && (
                <div className={styles.tokenRefreshed}>
                  <p>Token was refreshed during this request!</p>
                </div>
              )}
              
              <div className={styles.statusBadge}>
                {response.success ? 'SUCCESS' : 'FAILED'}
              </div>
              
              <pre className={styles.resultData}>
                {JSON.stringify(response.success ? response.data : { error: response.error }, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 