import { User, AuthTokens, LoginCredentials, JwtPayload } from '../types/auth';

// Test secret keys (should be stored in environment variables in production)
const JWT_SECRET = 'test-secret-key';
const JWT_REFRESH_SECRET = 'test-refresh-secret-key';

// Token expiration times in seconds (reduced for testing)
const ACCESS_TOKEN_EXPIRY = 30; // 30 seconds
const REFRESH_TOKEN_EXPIRY = 60; // 1 minute (reduced from 2 minutes)

// Test user data
const TEST_USER: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user'
};

// Current timestamp (in seconds)
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// Base64 encoding function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const base64Encode = (obj: any) => {
  return Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Base64 decoding function
const base64Decode = (str: string) => {
  // Replace '-' and '_' with '+' and '/'
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const pad = base64.length % 4;
  const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
  
  try {
    return JSON.parse(Buffer.from(paddedBase64, 'base64').toString());
  } catch {
    throw new Error('Invalid token');
  }
};

// Test JWT generation function
export const generateTestJwt = (): AuthTokens => {
  // Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = getCurrentTimestamp();
  
  // Access Token payload (valid for short time)
  const accessPayload: JwtPayload = {
    sub: TEST_USER.id,
    email: TEST_USER.email,
    name: TEST_USER.name,
    role: TEST_USER.role,
    iat: now,
    exp: now + ACCESS_TOKEN_EXPIRY // 30 seconds
  };
  
  // Refresh Token payload (valid for short time)
  const refreshPayload: JwtPayload = {
    sub: TEST_USER.id,
    email: TEST_USER.email,
    name: TEST_USER.name,
    role: TEST_USER.role,
    iat: now,
    exp: now + REFRESH_TOKEN_EXPIRY // 1 minute
  };
  
  // JWT creation (header.payload.signature)
  const accessHeader = base64Encode(header);
  const accessPayloadEncoded = base64Encode(accessPayload);
  // Note: Real JWT requires HMAC signature, but simplified for testing
  const accessSignature = base64Encode(`${JWT_SECRET}${accessHeader}${accessPayloadEncoded}`);
  const accessToken = `${accessHeader}.${accessPayloadEncoded}.${accessSignature}`;
  
  const refreshHeader = base64Encode(header);
  const refreshPayloadEncoded = base64Encode(refreshPayload);
  const refreshSignature = base64Encode(`${JWT_REFRESH_SECRET}${refreshHeader}${refreshPayloadEncoded}`);
  const refreshToken = `${refreshHeader}.${refreshPayloadEncoded}.${refreshSignature}`;
  
  console.log(`[TOKEN] Generated new tokens: Access (expires in ${ACCESS_TOKEN_EXPIRY}s), Refresh (expires in ${REFRESH_TOKEN_EXPIRY}s)`);
  return { accessToken, refreshToken };
};

// JWT decoding function
export const decodeJwt = (token: string): JwtPayload => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  
  try {
    return base64Decode(parts[1]) as JwtPayload;
  } catch {
    throw new Error('Invalid token payload');
  }
};

// Calculate remaining time for a token in seconds
export const getRemainingTime = (token: string): number => {
  try {
    const payload = decodeJwt(token);
    const now = getCurrentTimestamp();
    return Math.max(0, payload.exp - now);
  } catch {
    return 0;
  }
};

// JWT verification function (simplified for testing)
export const verifyJwt = (token: string): boolean => {
  try {
    const payload = decodeJwt(token);
    const now = getCurrentTimestamp();
    
    // Verify expiration time
    if (payload.exp < now) {
      console.log(`[TOKEN] Token expired at ${new Date(payload.exp * 1000).toLocaleTimeString()}, current time: ${new Date(now * 1000).toLocaleTimeString()}`);
      return false;
    }
    
    const remainingTime = payload.exp - now;
    console.log(`[TOKEN] Token valid, expires in ${remainingTime} seconds`);
    return true;
  } catch {
    console.log('[TOKEN] Invalid token format');
    return false;
  }
};

// Test login function
export const loginTest = async (credentials: LoginCredentials): Promise<{ user: User, tokens: AuthTokens }> => {
  console.log(`[AUTH] Login attempt for user: ${credentials.email}`);
  
  // In production, this would call an API to authenticate
  // For testing, just validate credentials and generate tokens
  if (credentials.email === TEST_USER.email && credentials.password === 'password') {
    const tokens = generateTestJwt();
    console.log('[AUTH] Login successful, tokens generated');
    return { user: TEST_USER, tokens };
  }
  
  console.log('[AUTH] Login failed: Invalid credentials');
  throw new Error('Invalid credentials');
};

// Test token refresh function
export const refreshTestToken = async (refreshToken: string): Promise<AuthTokens> => {
  console.log('[TOKEN] Attempting to refresh token');
  
  try {
    // Verify refresh token
    if (!verifyJwt(refreshToken)) {
      console.log('[TOKEN] Refresh token is invalid or expired');
      throw new Error('Invalid refresh token');
    }
    
    // Generate new tokens
    console.log('[TOKEN] Refresh token valid, generating new tokens');
    return generateTestJwt();
  } catch {
    console.log('[TOKEN] Token refresh failed');
    throw new Error('Token refresh failed');
  }
}; 