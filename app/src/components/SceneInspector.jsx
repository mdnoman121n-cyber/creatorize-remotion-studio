import React from 'react';

export const SceneInspector = ({
  scene,
  onUpdateScene,
  onOpenAIPrompt,
  projectConfig
}) => {
  if (!scene) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center text-slate-500 h-full">
        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span className="text-xs">Select a scene on the timeline to inspect and generate AI prompts</span>
      </div>
    );
  }

  const durationSec = (scene.durationFrames / projectConfig.fps).toFixed(2);

  const styleOptions = [
    { id: '3d-retro-ps1', label: '3D Retro PS1 / 90s Cyberspace', color: 'indigo' },
    { id: 'server-isometric', label: '3D Isometric Server Room', color: 'emerald' },
    { id: 'vox-collage', label: 'Vox-Style 2.5D Archival Collage', color: 'amber' },
    { id: 'kinetic-text', label: 'Kinetic Typography & Cloud Map', color: 'cyan' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SCENE #{scene.index}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {scene.startFrame}f → {scene.endFrame}f ({durationSec}s)
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-1">Scene Configuration</h3>
        </div>

        <button
          onClick={onOpenAIPrompt}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Get AI Prompt
        </button>
      </div>

      {/* Visual Theme Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400">Visual Theme / 3D Style:</label>
        <select
          value={scene.visualTheme}
          onChange={(e) => onUpdateScene({ ...scene, visualTheme: e.target.value })}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {styleOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Spoken Narration Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400">Spoken Voiceover Narration:</label>
        <textarea
          rows={3}
          value={scene.transcript}
          onChange={(e) => onUpdateScene({ ...scene, transcript: e.target.value })}
          className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
        />
      </div>

      {/* Word-level Timings Preview */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400">Word-Level Timestamps ({scene.words.length}):</label>
          <span className="text-[10px] text-cyan-400 font-mono">Microsecond Synchronized</span>
        </div>
        <div className="max-h-32 overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-2 flex flex-wrap gap-1.5">
          {scene.words.map((w, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1"
            >
              <span>{w.word}</span>
              <span className="text-[9px] text-slate-500">{w.startSec.toFixed(2)}s</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
