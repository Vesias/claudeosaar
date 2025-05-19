/**
 * Error Boundary component for graceful error handling
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    logger.error('Uncaught error', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      errorInfo
    });
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  
  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleReset);
      }
      
      // Default error UI
      return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-xl shadow-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Something went wrong
                </h2>
                <p className="text-sm text-neutral-400">
                  An unexpected error occurred
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-neutral-300 mb-2">
                We're sorry for the inconvenience. You can try:
              </p>
              <ul className="list-disc list-inside text-neutral-400 space-y-1">
                <li>Refreshing the page</li>
                <li>Going back to the homepage</li>
                <li>Contacting support if the issue persists</li>
              </ul>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-neutral-400 hover:text-neutral-300">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs overflow-auto text-red-400 font-mono">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg 
                         hover:bg-primary-700 transition-colors flex items-center 
                         justify-center gap-2 font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <a
                href="/"
                className="flex-1 bg-neutral-800 text-neutral-300 px-4 py-2 rounded-lg 
                         hover:bg-neutral-700 transition-colors flex items-center 
                         justify-center gap-2 font-medium border border-white/10"
              >
                <Home className="h-4 w-4" />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

/**
 * Custom error boundary for specific components
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: Error, reset: () => void) => ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};