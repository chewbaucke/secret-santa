'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="user-info">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="user-avatar"
            />
          )}
          <span className="user-name">{session?.user?.name || session?.user?.email}</span>
        </div>
        <button onClick={() => signOut()} className="sign-out-button">
          Sign Out
        </button>
      </div>

      <style jsx>{`
        .app-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          margin-bottom: 2rem;
          border-radius: 8px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .user-name {
          font-weight: 500;
        }

        .sign-out-button {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .sign-out-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
      `}</style>
    </header>
  );
}

