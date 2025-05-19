import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ClaudeOSaar - AI Development Workspace</title>
        <meta name="description" content="Sovereign AI development workspace with isolated containers and native Claude CLI integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      </AuthProvider>
    </>
  );
}

export default MyApp;