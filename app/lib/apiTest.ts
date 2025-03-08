import { verifyJwt, refreshTestToken } from "./auth";
import { AuthTokens } from "../types/auth";

// 가상의 API 엔드포인트 정의
export enum ApiEndpoint {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  ADMIN = 'admin'
}

// API 응답 타입
export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  tokenRefreshed?: boolean;
  newTokens?: AuthTokens;  // 토큰 갱신 시 새 토큰 정보 추가
}

// 테스트용 데이터
const mockData = {
  [ApiEndpoint.PUBLIC]: { message: 'This is public data, no auth required' },
  [ApiEndpoint.PROTECTED]: { message: 'This is protected data, authenticated user access only' },
  [ApiEndpoint.ADMIN]: { message: 'This is admin data, admin role required' }
};

/**
 * API 요청을 시뮬레이션하는 함수
 * @param endpoint API 엔드포인트
 * @param accessToken 액세스 토큰 (옵셔널, PUBLIC 엔드포인트는 불필요)
 * @param refreshToken 리프레시 토큰 (토큰 갱신에 사용)
 */
export const callTestApi = async (
  endpoint: ApiEndpoint,
  accessToken?: string,
  refreshToken?: string
): Promise<ApiResponse> => {
  console.log(`[API] Calling ${endpoint} API endpoint`);
  
  // PUBLIC 엔드포인트는 인증 필요 없음
  if (endpoint === ApiEndpoint.PUBLIC) {
    console.log('[API] Public endpoint accessed successfully');
    return {
      success: true,
      data: mockData[endpoint]
    };
  }
  
  // 보호된 엔드포인트는 토큰 필요
  if (!accessToken) {
    console.log('[API] Access token missing for protected endpoint');
    return {
      success: false,
      error: 'Authentication required'
    };
  }
  
  // 토큰 유효성 검증
  if (!verifyJwt(accessToken)) {
    console.log('[API] Access token invalid or expired');
    
    // 리프레시 토큰이 없으면 인증 실패
    if (!refreshToken) {
      console.log('[API] No refresh token available');
      return {
        success: false,
        error: 'Authentication expired, please log in again'
      };
    }
    
    // 리프레시 토큰으로 액세스 토큰 갱신 시도
    try {
      console.log('[API] Attempting to refresh token');
      const newTokens = await refreshTestToken(refreshToken);
      console.log('[API] Token refreshed successfully');
      
      // 토큰 갱신 성공, 새 토큰으로 요청 재시도
      console.log('[API] Retrying request with new token');
      const retryResponse = await retryApiCall(endpoint, newTokens.accessToken);
      
      return {
        ...retryResponse,
        tokenRefreshed: true,
        newTokens: newTokens  // 새 토큰 정보 응답에 포함
      };
    } catch {
      console.log('[API] Token refresh failed');
      return {
        success: false,
        error: 'Authentication expired, please log in again'
      };
    }
  }
  
  // ADMIN 엔드포인트는 추가 권한 검증 (간단한 구현)
  if (endpoint === ApiEndpoint.ADMIN) {
    // 실제로는 토큰에서 role 필드를 디코딩하여 확인해야 함
    // 테스트를 위해 50% 확률로 권한 거부 시뮬레이션
    if (Math.random() > 0.5) {
      console.log('[API] Insufficient permissions for admin endpoint');
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }
  }
  
  // 요청 성공
  console.log(`[API] ${endpoint} endpoint accessed successfully`);
  return {
    success: true,
    data: mockData[endpoint]
  };
};

// 새 토큰으로 API 호출 재시도
const retryApiCall = async (
  endpoint: ApiEndpoint,
  newAccessToken: string
): Promise<ApiResponse> => {
  // 토큰 유효성 검증
  if (!verifyJwt(newAccessToken)) {
    return {
      success: false,
      error: 'New token validation failed'
    };
  }
  
  return {
    success: true,
    data: mockData[endpoint]
  };
}; 