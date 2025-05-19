import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
// Duplicates removed, trpc import will be below with other tRPC related imports
import { trpc } from '@/lib/trpc/client';
import { ToastProvider } from '@/hooks/useToast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson'; // Import superjson
// import Observable from 'zen-observable-ts'; // Not needed if using standard links

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      // transformer: superjson, // REMOVED: Moved to httpBatchLink
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson, // ADDED: Transformer here
        }),
      ],
    })
  );

  return (
    <>
      <Head>
        <title>ClaudeOSaar - AI Development Workspace</title>
        <meta name="description" content="Sovereign AI development workspace with isolated containers and native Claude CLI integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

// Remove trpc.withTRPC HOC if createTRPCReact is used as it handles context differently.
// The Provider setup above is the modern way.
export default MyApp;
