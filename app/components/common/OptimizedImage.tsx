'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './OptimizedImage.module.scss';

// Image variant types for optimised handling
export type ImageVariant = 'cover' | 'avatar' | 'thumbnail' | 'inline';

// Priority levels for image loading
export type ImagePriority = 'high' | 'medium' | 'low';

// Aspect ratios for cover images
export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:2' | 'auto';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  variant?: ImageVariant;
  width?: number;
  height?: number;
  aspectRatio?: AspectRatio;
  priority?: ImagePriority;
  className?: string;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: 'eager' | 'lazy';
}

/**
 * OptimizedImage Component
 * 
 * Enhanced wrapper around Next.js Image with:
 * - Automatic variant-based optimisation
 * - Built-in error handling with fallback images
 * - Loading state management
 * - Accessibility improvements
 * - Performance optimisations for different image types
 */
export default function OptimizedImage({
  src,
  alt,
  variant = 'inline',
  width,
  height,
  aspectRatio = 'auto',
  priority = 'medium',
  className = '',
  fallbackSrc,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  sizes: customSizes,
  fill,
  quality = 85,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Generate optimised sizes based on variant
  const getOptimizedSizes = useCallback((): string => {
    if (customSizes) return customSizes;
    
    switch (variant) {
      case 'cover':
        return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
      case 'avatar':
        return '(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px';
      case 'thumbnail':
        return '(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px';
      case 'inline':
        return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw';
      default:
        return '100vw';
    }
  }, [variant, customSizes]);

  // Generate dimensions based on variant
  const getDimensions = useCallback(() => {
    if (fill) return { fill: true };
    if (width && height) return { width, height };
    
    switch (variant) {
      case 'avatar':
        return { width: 48, height: 48 };
      case 'thumbnail':
        return { width: 200, height: 200 };
      case 'cover':
        return { fill: true };
      case 'inline':
        return width && height ? { width, height } : { width: 400, height: 300 };
      default:
        return { width: 400, height: 300 };
    }
  }, [variant, width, height, fill]);

  // Generate CSS classes based on variant and state
  const getImageClasses = useCallback(() => {
    const classes = [styles.image];
    
    // Add variant-specific classes
    classes.push(styles[`image--${variant}`]);
    
    // Add aspect ratio classes for cover images
    if (variant === 'cover' && aspectRatio !== 'auto') {
      classes.push(styles[`image--${aspectRatio.replace(':', '-')}`]);
    }
    
    // Add state classes
    if (isLoading) classes.push(styles['image--loading']);
    if (hasError) classes.push(styles['image--error']);
    
    // Add custom classes
    if (className) classes.push(className);
    
    return classes.join(' ');
  }, [variant, aspectRatio, isLoading, hasError, className]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error with fallback
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback image if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    onError?.();
  }, [fallbackSrc, currentSrc, onError]);

  // Generate priority based on variant and priority prop
  const getImagePriority = useCallback(() => {
    if (priority === 'high') return true;
    if (priority === 'low') return false;
    
    // Auto-priority for above-the-fold content
    return variant === 'cover' || variant === 'avatar';
  }, [priority, variant]);

  // Generate loading strategy
  const getLoadingStrategy = useCallback(() => {
    if (loading === 'eager') return 'eager';
    if (getImagePriority()) return 'eager';
    return 'lazy';
  }, [loading, getImagePriority]);

  const dimensions = getDimensions();
  const imageSizes = getOptimizedSizes();
  const imageClasses = getImageClasses();
  const imagePriority = getImagePriority();
  const loadingStrategy = getLoadingStrategy();

  // Generate container classes for proper layout
  const containerClasses = [
    styles.container,
    styles[`container--${variant}`],
    aspectRatio !== 'auto' && variant === 'cover' ? styles[`container--${aspectRatio.replace(':', '-')}`] : '',
    isLoading ? styles['container--loading'] : '',
    hasError ? styles['container--error'] : '',
  ].filter(Boolean).join(' ');

  // Generate container styles to override CSS when width/height are provided
  const containerStyle = (width && height && variant === 'avatar') ? {
    width: `${width}px`,
    height: `${height}px`,
  } : {};

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className={styles.placeholder}>
          <div className={styles.spinner} />
        </div>
      )}
      
      {/* Error fallback */}
      {hasError && !fallbackSrc && (
        <div className={styles.fallback}>
          <div className={styles.fallbackIcon}>🖼️</div>
          <span className={styles.fallbackText}>Image unavailable</span>
        </div>
      )}
      
      {/* Optimised Next.js Image */}
      <Image
        src={currentSrc}
        alt={alt}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        priority={imagePriority}
        loading={loadingStrategy}
        quality={quality}
        sizes={imageSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        {...dimensions}
      />
    </div>
  );
} 