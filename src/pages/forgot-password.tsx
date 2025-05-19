import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For development, just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">ClaudeOSaar</h1>
          <p className="text-gray-600 mt-2">Passwort zurücksetzen</p>
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
              Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet.
            </div>
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Zurück zur Anmeldung
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  E-Mail-Adresse
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

              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Wird gesendet...' : 'Anweisungen senden'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Zurück zur Anmeldung
              </Link>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
          &copy; 2025 ClaudeOSaar Team
        </div>
      </div>
    </div>
  );
}