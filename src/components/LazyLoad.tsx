import React, { lazy, Suspense, ComponentType, useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingStates';
import { ErrorBoundary } from './ErrorBoundary';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

// FadeIn wrapper component
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure DOM is ready before starting animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`animate-fadeIn ${delay ? `animation-delay-${delay}` : ''}`}
      style={{ opacity: 0 }} // Initial state before animation starts
    >
      {children}
    </div>
  );
};

// Lazy load component with loading state and fadeIn effect
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  fadeDelay?: number
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <FadeIn delay={fadeDelay}>
        <LazyComponent {...props} />
      </FadeIn>
    </Suspense>
  );
}

// Lazy load with error boundary and fadeIn effect
export function lazyLoadWithErrorBoundary<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  errorFallback?: React.ReactNode,
  fadeDelay?: number
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <FadeIn delay={fadeDelay}>
          <LazyComponent {...props} />
        </FadeIn>
      </Suspense>
    </ErrorBoundary>
  );
}

// Preload component
export function preloadComponent(
  importFunc: () => Promise<{ default: ComponentType<any> }>
) {
  return importFunc();
}

// Intersection observer for lazy loading
export function useLazyLoad(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, callback, options]);
}