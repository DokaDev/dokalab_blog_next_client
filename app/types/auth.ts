export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// 테스트용 JWT 페이로드 인터페이스
export interface JwtPayload {
  sub: string;      // 사용자 ID
  email: string;    // 이메일
  name: string;     // 이름
  role: string;     // 역할
  iat: number;      // 발행 시간
  exp: number;      // 만료 시간
} 