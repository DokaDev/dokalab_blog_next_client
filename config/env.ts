/**
 * Environment configuration with type safety and validation
 * This centralises all environment variables used throughout the application
 */

// Validation helper functions
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidPort(port: string): boolean {
  const num = parseInt(port, 10);
  return !isNaN(num) && num > 0 && num < 65536;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation results tracking
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Track if validation has been performed to prevent duplicate warnings
let validationPerformed = false;

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

// Comprehensive environment variable validation
function validateEnvironment(isActualProduction: boolean): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Required variables with validation rules
  const requiredVars = [
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      value: process.env.NEXT_PUBLIC_SITE_URL,
      validator: isValidUrl,
      errorMessage: 'must be a valid URL'
    },
    {
      key: 'NEXT_PUBLIC_SITE_NAME',
      value: process.env.NEXT_PUBLIC_SITE_NAME,
      validator: (val: string) => val.length > 0 && val.length <= 100,
      errorMessage: 'must be 1-100 characters long'
    },
    {
      key: 'NEXT_PUBLIC_API_URL',
      value: process.env.NEXT_PUBLIC_API_URL,
      validator: isValidUrl,
      errorMessage: 'must be a valid URL'
    }
  ];
  
  // Validate required variables
  for (const { key, value, validator, errorMessage } of requiredVars) {
    if (!value) {
      if (isActualProduction) {
        result.errors.push(`${key} is required in production`);
        result.isValid = false;
      } else {
        result.warnings.push(`${key} is missing, using default value`);
      }
    } else if (!validator(value)) {
      result.errors.push(`${key} ${errorMessage}, got: ${value}`);
      result.isValid = false;
    }
  }
  
  // Optional variable validation
  const optionalVars = [
    {
      key: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
      value: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      validator: (val: string) => val.length >= 40,
      errorMessage: 'reCAPTCHA site key appears to be invalid'
    },
    {
      key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      value: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      validator: (val: string) => /^G-[A-Z0-9]{10}$/.test(val),
      errorMessage: 'Google Analytics measurement ID format is invalid'
    },
    {
      key: 'SMTP_PORT',
      value: process.env.SMTP_PORT,
      validator: isValidPort,
      errorMessage: 'SMTP port must be a valid port number (1-65535)'
    },
    {
      key: 'CONTACT_EMAIL_TO',
      value: process.env.CONTACT_EMAIL_TO,
      validator: isValidEmail,
      errorMessage: 'contact email must be a valid email address'
    }
  ];
  
  // Validate optional variables if they exist
  for (const { key, value, validator, errorMessage } of optionalVars) {
    if (value && !validator(value)) {
      result.warnings.push(`${key} ${errorMessage}, got: ${value}`);
    }
  }
  
  return result;
}

// Validate and parse environment variables
function getConfig(): EnvConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
    // Perform validation only once to prevent duplicate warnings
  if (!validationPerformed) {
    // Check if we're in a build environment (Next.js sets NODE_ENV=production during build)
    const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build';
    const isActualProduction = isProduction && !isBuildTime && !isDevelopment;
    
    const validation = validateEnvironment(isActualProduction);
    validationPerformed = true;
    
    // Only show detailed validation during development or actual production runtime
    // Simplify messages during build to avoid worker process duplication
    if (!isBuildTime) {
      // Output validation results
      if (validation.errors.length > 0) {
        console.error('❌ Environment variable validation failed:');
        validation.errors.forEach(error => console.error(`   • ${error}`));
        
        if (isActualProduction) {
          throw new Error('Invalid environment configuration in production');
        }
      }
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️  Environment variable warnings:');
        validation.warnings.forEach(warning => console.warn(`   • ${warning}`));
        
        if (!isDevelopment) {
          console.warn('   Consider setting proper values for production deployment.');
        }
      }
      
      if (validation.errors.length === 0 && validation.warnings.length === 0) {
        console.log('✅ Environment variables validated successfully');
      }
    } else {
      // During build, only show a simple summary
      if (validation.errors.length > 0 && isActualProduction) {
        throw new Error('Invalid environment configuration in production');
      }
      
      if (validation.warnings.length > 0) {
        console.warn(`⚠️  ${validation.warnings.length} environment variables using default values (consider setting for production)`);
      }
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

// Type guard functions for runtime validation
export function assertValidUrl(url: string, context: string): asserts url is string {
  if (!isValidUrl(url)) {
    throw new Error(`Invalid URL in ${context}: ${url}`);
  }
}

export function assertValidEmail(email: string, context: string): asserts email is string {
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email in ${context}: ${email}`);
  }
}

export function assertValidPort(port: number | string, context: string): asserts port is number {
  const portNum = typeof port === 'string' ? parseInt(port, 10) : port;
  if (!isValidPort(portNum.toString())) {
    throw new Error(`Invalid port in ${context}: ${port}`);
  }
}

// Safe environment variable accessors with validation
export function getSafeUrl(key: keyof EnvConfig, fallback?: string): string {
  const value = config[key] as string || fallback;
  if (!value) {
    throw new Error(`Required URL environment variable '${String(key)}' is not set`);
  }
  assertValidUrl(value, `environment variable '${String(key)}'`);
  return value;
}

export function getSafeString(key: keyof EnvConfig, fallback?: string): string {
  const value = config[key] as string || fallback;
  if (!value) {
    throw new Error(`Required environment variable '${String(key)}' is not set`);
  }
  return value;
}

// Reset validation flag for testing purposes
export function resetValidation(): void {
  if (process.env.NODE_ENV === 'test') {
    validationPerformed = false;
  }
} 