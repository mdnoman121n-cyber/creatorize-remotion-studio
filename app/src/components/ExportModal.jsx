import React, { useState } from 'react';

export const ExportModal = ({ timeline, projectConfig, onClose }) => {
  const [resolution, setResolution] = useState('1080p');
  const [concurrency, setConcurrency] = useState('8');
  const [copied, setCopied] = useState(false);

  const resFlags = {
    '1080p': '--width=1920 --height=1080',
    '4k': '--width=3840 --height=2160',
    'shorts': '--width=1080 --height=1920'
  }[resolution];

  const renderCommand = `npx remotion render Root out/creatorize_video.mp4 ${resFlags} --concurrency=${concurrency} --props=./timeline.json`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(renderCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTimeline = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'timeline.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
              <svg className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                Export Deterministic Video
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Hardware accelerated Remotion render via headless Chromium
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>Resolution:</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="studio-select"
                style={{ width: '100%' }}
              >
                <option value="1080p">1080p Full HD (1920×1080)</option>
                <option value="4k">4K Ultra HD (3840×2160)</option>
                <option value="shorts">9:16 Vertical (1080×1920)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>Threads / Concurrency:</label>
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(e.target.value)}
                className="studio-select"
                style={{ width: '100%' }}
              >
                <option value="4">4 CPU Threads</option>
                <option value="8">8 CPU Threads (Recommended)</option>
                <option value="16">16 CPU Threads (Fastest)</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>Remotion CLI Command:</div>
            <div className="code-snippet-box">
              {renderCommand}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={handleDownloadTimeline} className="btn btn-secondary">
            Download timeline.json
          </button>
          <button onClick={handleCopyCmd} className={`btn ${copied ? 'btn-secondary' : 'btn-gradient'}`}>
            {copied ? '✓ Command Copied!' : 'Copy Terminal Command'}
          </button>
        </div>
      </div>
    </div>
  );
};
