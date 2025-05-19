import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Globe, Server, Database, Brain } from 'lucide-react';

export function LoadingSpinner({ 
  size = 'md', 
  message 
}: { 
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
      {message && (
        <p className="text-neutral-400 text-sm">{message}</p>
      )}
    </div>
  );
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur opacity-25 animate-pulse"></div>
          <div className="relative bg-neutral-900 rounded-lg p-8 border border-white/10">
            <Globe className="w-12 h-12 text-primary-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold text-white mb-2">ClaudeOSaar</h2>
            <p className="text-neutral-400">{message}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function WorkspaceLoader() {
  const icons = [Server, Database, Brain, Globe];
  
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-4 mb-8">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-8 h-8 text-primary-500" />
            </motion.div>
          ))}
        </div>
        <LoadingSpinner size="lg" message="Initializing workspace..." />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-neutral-900 rounded-xl border border-white/10 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-neutral-800 rounded-lg"></div>
        <div className="w-20 h-6 bg-neutral-800 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
        <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
        <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="bg-neutral-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-neutral-700 rounded flex-1"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border-b border-white/5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-neutral-700 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingOverlay({ 
  isLoading, 
  children,
  message = "Loading..."
}: { 
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50">{children}</div>
      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-neutral-900 rounded-lg p-6 border border-white/10">
          <LoadingSpinner message={message} />
        </div>
      </div>
    </div>
  );
}