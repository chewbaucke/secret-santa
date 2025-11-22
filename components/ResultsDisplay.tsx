'use client';

import { useState } from 'react';
import { Assignment } from '@/lib/secret-santa';

interface ResultsDisplayProps {
  assignments: Assignment[];
}

export default function ResultsDisplay({ assignments }: ResultsDisplayProps) {
  const [selectedGiver, setSelectedGiver] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = assignments
      .map((a) => `${a.giver} → ${a.receiver}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedAssignment = selectedGiver
    ? assignments.find((a) => a.giver === selectedGiver)
    : null;

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>🎁 Secret Santa Assignments</h2>
        <button onClick={handleCopy} className="copy-button">
          {copied ? '✓ Copied!' : '📋 Copy All'}
        </button>
      </div>

      <div className="results-content">
        <div className="assignments-list">
          {assignments.map((assignment) => (
            <div
              key={assignment.giver}
              className={`assignment-item ${
                selectedGiver === assignment.giver ? 'selected' : ''
              }`}
              onClick={() => setSelectedGiver(assignment.giver)}
            >
              <div className="giver">{assignment.giver}</div>
              <div className="arrow">→</div>
              <div className="receiver">{assignment.receiver}</div>
            </div>
          ))}
        </div>

        {selectedAssignment && (
          <div className="selected-details">
            <div className="detail-card">
              <div className="detail-label">You are giving a gift to:</div>
              <div className="detail-value">{selectedAssignment.receiver}</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .results-display {
          margin-top: 1rem;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .results-header h2 {
          color: #333;
          margin: 0;
        }

        .copy-button {
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .copy-button:hover {
          background: #5568d3;
        }

        .results-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .results-content {
            grid-template-columns: 2fr 1fr;
          }
        }

        .assignments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .assignment-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .assignment-item:hover {
          background: #f0f0f0;
          border-color: #667eea;
          transform: translateX(4px);
        }

        .assignment-item.selected {
          background: #e8edff;
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }

        .giver {
          font-weight: 600;
          color: #333;
          min-width: 100px;
        }

        .arrow {
          color: #667eea;
          font-weight: bold;
        }

        .receiver {
          font-weight: 600;
          color: #667eea;
          min-width: 100px;
        }

        .selected-details {
          position: sticky;
          top: 1rem;
          height: fit-content;
        }

        .detail-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .detail-label {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .detail-value {
          font-size: 2rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

