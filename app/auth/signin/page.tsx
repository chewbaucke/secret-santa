'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>🎄 Secret Santa Generator</h1>
        <p className="subtitle">Sign in to create your Secret Santa exchange</p>

        <div className="providers">
          <button
            className="provider-button google"
            onClick={() => signIn('google', { callbackUrl })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>

      <style jsx>{`
        .signin-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .signin-card {
          background: white;
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .signin-card h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .providers {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .provider-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #333;
          cursor: pointer;
          transition: all 0.2s;
        }

        .provider-button:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .provider-button.google:hover {
          border-color: #4285f4;
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
        }

        .provider-button svg {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="signin-container">
        <div className="signin-card">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}

