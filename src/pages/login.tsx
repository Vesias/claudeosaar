import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the login function from the auth context
      const success = await login(email, password);
      
      if (success) {
        // Redirect happens automatically in useEffect
      } else {
        setError('Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">ClaudeOSaar</h1>
          <p className="text-gray-600 mt-2">AI Development Workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Anmeldung...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Passwort vergessen?
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
          &copy; 2025 ClaudeOSaar Team
        </div>
      </div>
    </div>
  );
}