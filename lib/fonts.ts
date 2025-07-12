/**
 * Centralised Font Management System
 * Optimised font loading using Next.js built-in font optimization
 * 
 * Features:
 * - Self-hosted Google Fonts (no external requests)
 * - Automatic preloading and display optimisation
 * - CSS variables for easy usage across components
 * - Reduced CLS (Cumulative Layout Shift)
 * - Font subsetting for better performance
 */

import { Inter, JetBrains_Mono } from 'next/font/google';

// =============================================================================
// FONT CONFIGURATIONS
// =============================================================================

/**
 * Inter - Primary font for body text and headings
 * 
 * - Variable font with weight range 100-900
 * - Optimised for web readability
 * - Supports multiple languages
 * - Perfect for technical content
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ]
});

/**
 * JetBrains Mono - Monospace font for code blocks
 * 
 * - Designed specifically for developers
 * - Excellent character distinction (0 vs O, 1 vs l)
 * - Ligature support for better code readability
 * - Optimised for programming syntax
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  fallback: [
    'Monaco',
    'Menlo',
    'Consolas',
    'Courier New',
    'monospace'
  ]
});

// =============================================================================
// FONT UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all font variables for CSS class application
 * Usage: <html className={getFontVariables()}>
 */
export function getFontVariables(): string {
  return `${inter.variable} ${jetbrainsMono.variable}`;
}

/**
 * Get font class names for specific usage
 * Usage: <div className={getFontClassName('inter')}>
 */
export function getFontClassName(fontType: 'inter' | 'code'): string {
  switch (fontType) {
    case 'inter':
      return inter.className;
    case 'code':
      return jetbrainsMono.className;
    default:
      return inter.className;
  }
}

// =============================================================================
// FONT WEIGHT CONSTANTS
// =============================================================================

/**
 * Standardised font weights for consistent typography
 * Maps to Inter font weight values
 */
export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
} as const;

/**
 * Font size constants for consistent sizing
 * Based on typographic scale
 */
export const FONT_SIZES = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '4rem'     // 64px
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type FontWeight = keyof typeof FONT_WEIGHTS;
export type FontSize = keyof typeof FONT_SIZES;
export type FontType = 'inter' | 'code'; 