'use client';

import { useState } from 'react';
import { Participant } from '@/lib/secret-santa';

interface ConstraintsManagerProps {
  participants: Participant[];
  onUpdateConstraints: (participantName: string, notAllowedNames: string[]) => void;
}

export default function ConstraintsManager({
  participants,
  onUpdateConstraints,
}: ConstraintsManagerProps) {
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  const toggleExpanded = (name: string) => {
    setExpandedParticipant(expandedParticipant === name ? null : name);
  };

  const toggleConstraint = (participantName: string, constraintName: string) => {
    const participant = participants.find((p) => p.name === participantName);
    if (!participant) return;

    const currentConstraints = participant.notAllowedNames;
    const newConstraints = currentConstraints.includes(constraintName)
      ? currentConstraints.filter((n) => n !== constraintName)
      : [...currentConstraints, constraintName];

    onUpdateConstraints(participantName, newConstraints);
  };

  return (
    <div className="constraints-manager">
      <h2>Constraints</h2>
      <p className="subtitle">
        Specify who each person cannot be assigned to (e.g., family members, partners)
      </p>

      <div className="constraints-list">
        {participants.map((participant) => {
          const isExpanded = expandedParticipant === participant.name;
          const availableConstraints = participants
            .map((p) => p.name)
            .filter((name) => name !== participant.name);

          return (
            <div key={participant.name} className="constraint-item">
              <button
                className="constraint-header"
                onClick={() => toggleExpanded(participant.name)}
              >
                <span className="participant-name">{participant.name}</span>
                <span className="constraint-count">
                  {participant.notAllowedNames.length} constraint
                  {participant.notAllowedNames.length !== 1 ? 's' : ''}
                </span>
                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              </button>

              {isExpanded && (
                <div className="constraint-options">
                  {availableConstraints.length === 0 ? (
                    <p className="no-options">No other participants available</p>
                  ) : (
                    availableConstraints.map((constraintName) => {
                      const isChecked = participant.notAllowedNames.includes(constraintName);
                      return (
                        <label key={constraintName} className="constraint-checkbox">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleConstraint(participant.name, constraintName)}
                          />
                          <span>{constraintName}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .constraints-manager h2 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .constraints-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .constraint-item {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .constraint-item:hover {
          border-color: #667eea;
        }

        .constraint-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #f9f9f9;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .constraint-header:hover {
          background: #f0f0f0;
        }

        .participant-name {
          font-weight: 600;
          color: #333;
        }

        .constraint-count {
          color: #666;
          font-size: 0.9rem;
          margin-left: auto;
          margin-right: 1rem;
        }

        .expand-icon {
          color: #667eea;
          font-size: 0.8rem;
        }

        .constraint-options {
          padding: 1rem;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .no-options {
          color: #999;
          font-style: italic;
        }

        .constraint-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .constraint-checkbox:hover {
          background: #f5f5f5;
        }

        .constraint-checkbox input[type='checkbox'] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .constraint-checkbox span {
          color: #333;
        }
      `}</style>
    </div>
  );
}

