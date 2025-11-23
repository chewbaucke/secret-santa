'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Participant, Assignment, generateSecretSanta } from '@/lib/secret-santa';
import {
  loadParticipantsFromStorage,
  saveParticipantsToStorage,
  loadAssignmentsFromStorage,
  saveAssignmentsToStorage,
  clearAssignmentsFromStorage,
} from '@/lib/storage';
import ParticipantManager from '@/components/ParticipantManager';
import ConstraintsManager from '@/components/ConstraintsManager';
import ResultsDisplay from '@/components/ResultsDisplay';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';

function HomeContent() {
  const { data: session } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const userId = session?.user?.id;

  // Load participants and assignments from localStorage on mount
  useEffect(() => {
    if (!userId) return;

    const storedParticipants = loadParticipantsFromStorage(userId);
    if (storedParticipants.length > 0) {
      setParticipants(storedParticipants);
    }

    const storedAssignments = loadAssignmentsFromStorage(userId);
    if (storedAssignments && storedAssignments.length > 0) {
      setAssignments(storedAssignments);
    }
  }, [userId]);

  // Save to localStorage whenever participants change
  useEffect(() => {
    if (participants.length > 0 && userId) {
      saveParticipantsToStorage(participants, userId);
    }
  }, [participants, userId]);

  const handleAddParticipant = (name: string) => {
    if (name.trim() === '') return;
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Participant already exists');
      return;
    }
    setParticipants([...participants, { name: name.trim(), notAllowedNames: [] }]);
    setError(null);
  };

  const handleRemoveParticipant = (name: string) => {
    // Remove participant and clean up constraints
    setParticipants((prev) =>
      prev
        .filter((p) => p.name !== name)
        .map((p) => ({
          ...p,
          notAllowedNames: p.notAllowedNames.filter((n) => n !== name),
        }))
    );
    setAssignments(null);
    clearAssignmentsFromStorage(userId);
  };

  const handleUpdateConstraints = (participantName: string, notAllowedNames: string[]) => {
    setParticipants(
      participants.map((p) =>
        p.name === participantName
          ? { ...p, notAllowedNames }
          : p
      )
    );
    setAssignments(null);
    clearAssignmentsFromStorage(userId);
  };

  const handleGenerate = () => {
    if (participants.length < 2) {
      setError('Need at least 2 participants');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAssignments(null);

    try {
      const result = generateSecretSanta(participants);
      setAssignments(result.assignments);
      saveAssignmentsToStorage(result.assignments, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate assignments');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="container">
      <Header />
      <div className="header">
        <h1>🎄 Secret Santa Generator</h1>
        <p>Create random gift exchange assignments with custom constraints</p>
      </div>

      <div className="content">
        <div className="section">
          <ParticipantManager
            participants={participants}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
          />
        </div>

        {participants.length > 0 && (
          <div className="section">
            <ConstraintsManager
              participants={participants}
              onUpdateConstraints={handleUpdateConstraints}
            />
          </div>
        )}

        {participants.length >= 2 && (
          <div className="section">
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : '🎁 Generate Assignments'}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {assignments && (
          <div className="section">
            <ResultsDisplay
              assignments={assignments}
              onClear={() => {
                setAssignments(null);
                clearAssignmentsFromStorage(userId);
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: 100vh;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .section {
          margin-bottom: 2rem;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .generate-button {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

