/**
 * Environment configuration with type safety and validation
 * This centralises all environment variables used throughout the application
 */

// Define environment variable schema
interface EnvConfig {
  // Application
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  
  // API Configuration
  apiUrl: string;
  apiSecretKey?: string;
  
  // Google reCAPTCHA
  recaptchaSiteKey?: string;
  recaptchaSecretKey?: string;
  
  // Analytics
  gaMeasurementId?: string;
  
  // Email Configuration (server-side only)
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  contactEmailTo?: string;
  
  // Feature Flags
  features: {
    comments: boolean;
    search: boolean;
    newsletter: boolean;
    debug: boolean;
  };
  
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Validate and parse environment variables
function getConfig(): EnvConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
  // Validate required environment variables
  const requiredVars = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };
  
  // Check for missing required variables in production
  if (isProduction) {
    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (missingVars.length > 0) {
      console.warn(
        `⚠️  Missing required environment variables: ${missingVars.join(', ')}`
      );
      console.warn('Using default values for missing environment variables.');
      console.warn('Set these variables in production for proper functionality.');
    }
  }
  
  return {
    // Application
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'DokaLab Blog',
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A personal tech blog',
    
    // API Configuration
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    apiSecretKey: process.env.API_SECRET_KEY,
    
    // Google reCAPTCHA
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    
    // Analytics
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    
    // Email Configuration (only available server-side)
    smtp: process.env.SMTP_HOST ? {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    } : undefined,
    contactEmailTo: process.env.CONTACT_EMAIL_TO,
    
    // Feature Flags
    features: {
      comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
      search: process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false', // Default true
      newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
      debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' || isDevelopment,
    },
    
    // Environment
    isDevelopment,
    isProduction,
    isTest,
  };
}

// Export singleton config object
export const config = getConfig();

// Export helper functions for common checks
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

// Type-safe environment variable access
export function getEnv<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  return config[key];
}

// Debug logger that respects feature flag
export function debugLog(...args: unknown[]) {
  if (config.features.debug) {
    console.log('[DEBUG]', ...args);
  }
} 