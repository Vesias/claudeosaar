// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureComponent(componentName: string, renderTime: number) {
    const metrics = this.metrics.get(componentName) || [];
    metrics.push(renderTime);
    this.metrics.set(componentName, metrics);

    // Log slow renders
    if (renderTime > 16) { // 60fps threshold
      console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`);
    }
  }

  // Measure API call time
  async measureAPICall<T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - start;
      
      this.recordAPIMetric(endpoint, duration, 'success');
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordAPIMetric(endpoint, duration, 'error');
      throw error;
    }
  }

  private recordAPIMetric(endpoint: string, duration: number, status: string) {
    const key = `api:${endpoint}:${status}`;
    const metrics = this.metrics.get(key) || [];
    metrics.push(duration);
    this.metrics.set(key, metrics);

    // Log slow API calls
    if (duration > 1000) {
      console.warn(`Slow API call: ${endpoint} took ${duration}ms`);
    }
  }

  // Get performance report
  getReport() {
    const report: Record<string, any> = {};

    this.metrics.forEach((values, key) => {
      const sorted = values.sort((a, b) => a - b);
      const sum = values.reduce((acc, val) => acc + val, 0);
      
      report[key] = {
        count: values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / values.length,
        p50: sorted[Math.floor(values.length * 0.5)],
        p95: sorted[Math.floor(values.length * 0.95)],
        p99: sorted[Math.floor(values.length * 0.99)],
      };
    });

    return report;
  }

  // Clear metrics
  clear() {
    this.metrics.clear();
  }

  // Web Vitals monitoring
  static monitorWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// React hook for performance monitoring
import { useEffect, useRef } from 'react';

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>();
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        performanceMonitor.measureComponent(componentName, renderTime);
      }
    };
  });
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (!inThrottle || now - lastTime >= wait) {
      func(...args);
      lastTime = now;
      inThrottle = true;
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}