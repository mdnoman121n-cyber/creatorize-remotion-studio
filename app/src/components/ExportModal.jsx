import React, { useState } from 'react';

export const ExportModal = ({ timeline, projectConfig, onClose }) => {
  const [resolution, setResolution] = useState('1080p');
  const [concurrency, setConcurrency] = useState('8');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const resParams = {
    '1080p': '--width=1920 --height=1080',
    '4k': '--width=3840 --height=2160',
    'shorts': '--width=1080 --height=1920'
  }[resolution];

  const renderCommand = `npx remotion render Root out/creatorize_video.mp4 ${resParams} --concurrency=${concurrency} --props=./timeline.json`;

  const handleDownloadTimeline = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'timeline.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(renderCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Export Remotion Video</h2>
              <p className="text-[11px] text-slate-400">Deterministic 1080p/4K Local Hardware Render</p>
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

        {/* Export Form */}
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Output Resolution:</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              >
                <option value="1080p">1080p Full HD (1920x1080)</option>
                <option value="4k">4K Ultra HD (3840x2160)</option>
                <option value="shorts">9:16 Vertical Shorts (1080x1920)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">CPU Threads / Concurrency:</label>
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
              >
                <option value="4">4 Threads</option>
                <option value="8">8 Threads (Recommended)</option>
                <option value="16">16 Threads (High-end CPU)</option>
              </select>
            </div>
          </div>

          {/* Render Command Box */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Headless Remotion Render Command:</label>
              <span className="text-[10px] text-emerald-400 font-mono">100% Free • No Cloud Credits</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3">
              <code className="text-xs text-cyan-300 font-mono break-all">{renderCommand}</code>
              <button
                onClick={handleCopyCmd}
                className="shrink-0 p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Copy Command"
              >
                {copiedCmd ? (
                  <span className="text-xs text-emerald-400 font-sans">Copied!</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Download timeline.json */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Save Timeline Configuration</div>
              <div className="text-[11px] text-slate-500">Download normalized timeline.json with all cue points</div>
            </div>
            <button
              onClick={handleDownloadTimeline}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download timeline.json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
