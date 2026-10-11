import React, { useState } from 'react';
import { generateScenePrompt } from '../utils/promptTemplates';

export const AIPromptModal = ({ scene, projectConfig, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('antigravity');

  if (!scene) return null;

  const promptText = generateScenePrompt(scene, projectConfig);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const agents = [
    { id: 'antigravity', name: 'Google Antigravity IDE' },
    { id: 'claude', name: 'Claude Code CLI' },
    { id: 'cursor', name: 'Cursor' },
    { id: 'codex', name: 'OpenAI Codex' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
              <svg className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                AI Agent Prompt Synthesizer
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Scene #{scene.index} • {scene.durationFrames} Frames • {scene.visualTheme}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Assistant Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Target Assistant:</span>
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAgent(a.id)}
                className={`btn ${selectedAgent === a.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {a.name}
              </button>
            ))}
          </div>

          {/* Prompt Codebox */}
          <div className="code-snippet-box">
            {promptText}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handleCopy} className={`btn ${copied ? 'btn-secondary' : 'btn-gradient'}`}>
            {copied ? '✓ Prompt Copied to Clipboard!' : 'Copy Prompt for Agent'}
          </button>
        </div>
      </div>
    </div>
  );
};
