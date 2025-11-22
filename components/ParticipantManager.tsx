'use client';

import { useState } from 'react';
import { Participant } from '@/lib/secret-santa';

interface ParticipantManagerProps {
  participants: Participant[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export default function ParticipantManager({
  participants,
  onAdd,
  onRemove,
}: ParticipantManagerProps) {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName);
      setNewName('');
    }
  };

  return (
    <div className="participant-manager">
      <h2>Participants</h2>
      <p className="subtitle">Add people to the Secret Santa exchange</p>

      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter participant name"
          className="name-input"
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      {participants.length === 0 ? (
        <div className="empty-state">
          <p>No participants yet. Add some people to get started!</p>
        </div>
      ) : (
        <div className="participant-list">
          {participants.map((participant) => (
            <div key={participant.name} className="participant-item">
              <span className="participant-name">{participant.name}</span>
              <button
                onClick={() => onRemove(participant.name)}
                className="remove-button"
                aria-label={`Remove ${participant.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .participant-manager h2 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .add-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .name-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .name-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .add-button {
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-button:hover {
          background: #5568d3;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #999;
        }

        .participant-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .participant-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f5f5f5;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .participant-item:hover {
          background: #eeeeee;
        }

        .participant-name {
          font-weight: 500;
          color: #333;
        }

        .remove-button {
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          transition: background 0.2s;
        }

        .remove-button:hover {
          background: #cc0000;
        }
      `}</style>
    </div>
  );
}

