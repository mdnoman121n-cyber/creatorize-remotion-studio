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
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Agent Prompt Generator</h2>
              <p className="text-[11px] text-slate-400">
                Copy and paste into your local coding assistant (Claude, Antigravity, Cursor, Codex)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Agent Target Pills */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Target AI Assistant:</span>
          {['Antigravity IDE', 'Claude Code CLI', 'Cursor', 'OpenAI Codex'].map((agent) => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent.toLowerCase().split(' ')[0])}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedAgent === agent.toLowerCase().split(' ')[0]
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {agent}
            </button>
          ))}
        </div>

        {/* Prompt Content */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs bg-slate-950/80 text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {promptText}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Target File:{' '}
            <span className="font-mono text-indigo-400">src/remotion/scenes/{scene.componentFile}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-lg transition flex items-center gap-2 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prompt Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt for Agent
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
