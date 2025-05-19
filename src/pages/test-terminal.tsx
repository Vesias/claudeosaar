import React from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '../ui/error/ErrorBoundary';

// Dynamically import the TerminalDemo to improve page load performance
const TerminalDemo = dynamic(() => import('../components/TerminalDemo'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-32">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-md bg-neutral-200 dark:bg-neutral-800 h-8 w-24 mb-4"></div>
        <div className="h-32 w-full max-w-3xl bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
      </div>
    </div>
  )
});

export default function TestTerminalPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="bg-neutral-900 border-b border-neutral-800 p-4 text-center">
        <h1 className="text-2xl font-bold">Terminal Demo Test Page</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <ErrorBoundary>
          <TerminalDemo />
        </ErrorBoundary>
      </main>
    </div>
  );
}