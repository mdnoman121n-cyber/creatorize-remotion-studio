import React from 'react';

export const Header = ({ onOpenExport, onLoadSample, projectConfig, setProjectConfig }) => {
  return (
    <header className="studio-header">
      {/* Brand & Project Status */}
      <div className="studio-brand">
        <div className="brand-icon-box">
          <svg className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="brand-title">
            Creatorize Remotion Studio
            <span className="brand-badge">PRO v1.2</span>
          </div>
          <div className="brand-subtitle">Code-Driven AI Video Production Engine</div>
        </div>
      </div>

      {/* Header Toolbar Controls */}
      <div className="header-controls">
        <div className="control-group">
          <span>FPS:</span>
          <select
            value={projectConfig.fps}
            onChange={(e) => setProjectConfig({ ...projectConfig, fps: parseInt(e.target.value) })}
            className="studio-select"
          >
            <option value={24}>24 FPS (Cinematic)</option>
            <option value={30}>30 FPS (Standard)</option>
            <option value={60}>60 FPS (Ultra Smooth)</option>
          </select>
        </div>

        <div className="control-group">
          <span>Aspect:</span>
          <select
            value={`${projectConfig.width}x${projectConfig.height}`}
            onChange={(e) => {
              const [w, h] = e.target.value.split('x').map(Number);
              setProjectConfig({ ...projectConfig, width: w, height: h });
            }}
            className="studio-select"
          >
            <option value="1920x1080">16:9 Landscape (1080p)</option>
            <option value="3840x2160">16:9 4K Cinema</option>
            <option value="1080x1920">9:16 Vertical (Shorts/Reels)</option>
          </select>
        </div>

        <button onClick={onLoadSample} className="btn btn-secondary" title="Load built-in 1990s documentary sample">
          <svg className="icon-xs" style={{ color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Load 1990s Sample
        </button>

        <button onClick={onOpenExport} className="btn btn-gradient">
          <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Export Remotion Video
        </button>
      </div>
    </header>
  );
};
