import React, { useState, useRef } from 'react';
import { parseSubtitleText } from '../utils/srtParser';
import { parseWordLevelJson } from '../utils/jsonTranscriptParser';

export const SidebarInspector = ({
  activeTab,
  setActiveTab,
  scene,
  onUpdateScene,
  onOpenAIPrompt,
  projectConfig,
  audioInfo,
  transcriptInfo,
  onAudioLoaded,
  onTranscriptLoaded,
  onLoadSample
}) => {
  const audioInputRef = useRef(null);
  const transcriptInputRef = useRef(null);

  const styleOptions = [
    { id: '3d-retro-ps1', label: '3D Retro PS1', desc: 'Wireframe grid, CRT glow & cyber sun' },
    { id: 'server-isometric', label: 'Isometric Server', desc: 'Server racks & blinking status LEDs' },
    { id: 'vox-collage', label: 'Vox 2.5D Collage', desc: 'Paper cutout, archival clippings & parallax' },
    { id: 'kinetic-text', label: 'Kinetic Typography', desc: 'Word-by-word active glow & cloud nodes' }
  ];

  const handleAudioFile = (file) => {
    if (!file) return;
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio();
    audio.src = audioUrl;
    audio.onloadedmetadata = () => {
      onAudioLoaded({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        durationSec: audio.duration,
        url: audioUrl,
        file
      });
    };
  };

  const handleTranscriptFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        let scenes = [];
        if (file.name.endsWith('.json')) {
          scenes = parseWordLevelJson(JSON.parse(text), projectConfig.fps);
        } else {
          scenes = parseSubtitleText(text, projectConfig.fps);
        }
        onTranscriptLoaded({
          name: file.name,
          type: file.name.endsWith('.json') ? 'Word-Level Timed JSON' : 'SRT / VTT Subtitles',
          scenes
        });
      } catch (err) {
        alert('Failed to parse transcript: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const durationSec = scene ? (scene.durationFrames / projectConfig.fps).toFixed(2) : '0.00';

  return (
    <aside className="studio-sidebar">
      {/* Tab Switcher */}
      <div className="sidebar-tabs">
        <button
          onClick={() => setActiveTab('scene')}
          className={`sidebar-tab ${activeTab === 'scene' ? 'active' : ''}`}
        >
          <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Scene & AI
        </button>

        <button
          onClick={() => setActiveTab('ingest')}
          className={`sidebar-tab ${activeTab === 'ingest' ? 'active' : ''}`}
        >
          <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Ingest Media
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`sidebar-tab ${activeTab === 'code' ? 'active' : ''}`}
        >
          <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Remotion Code
        </button>
      </div>

      {/* Tab 1: Scene & AI Prompt */}
      {activeTab === 'scene' && (
        <div className="sidebar-content">
          {scene ? (
            <>
              {/* Scene Info Banner */}
              <div className="inspector-card">
                <div className="card-title">
                  <span>SCENE #{scene.index} METADATA</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {scene.startFrame}f → {scene.endFrame}f ({durationSec}s)
                  </span>
                </div>

                <button onClick={onOpenAIPrompt} className="btn btn-primary" style={{ width: '100%' }}>
                  <svg className="icon-xs" style={{ color: '#38bdf8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate AI Agent Prompt
                </button>
              </div>

              {/* Visual Style Selection */}
              <div className="inspector-card">
                <div className="card-title">VISUAL STYLE / 3D PRESET</div>
                <div className="style-selector-grid">
                  {styleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateScene({ ...scene, visualTheme: opt.id })}
                      className={`style-pill-btn ${scene.visualTheme === opt.id ? 'active' : ''}`}
                    >
                      <span className="style-name">{opt.label}</span>
                      <span className="style-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spoken Voiceover Narration */}
              <div className="inspector-card">
                <div className="card-title">SPOKEN DIALOGUE / TRANSCRIPT</div>
                <textarea
                  rows={3}
                  value={scene.transcript}
                  onChange={(e) => onUpdateScene({ ...scene, transcript: e.target.value })}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
              </div>

              {/* Word Timestamps */}
              <div className="inspector-card">
                <div className="card-title">
                  <span>TIMED WORDS ({scene.words.length})</span>
                  <span style={{ fontSize: '9px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    MICROSECOND SYNC
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                  {scene.words.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: '#cbd5e1'
                      }}
                    >
                      {w.word} <span style={{ color: 'var(--text-dim)', fontSize: '9px' }}>{w.startSec.toFixed(1)}s</span>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
              Select a scene from the timeline below to inspect and generate prompts.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Ingest Media & Transcripts */}
      {activeTab === 'ingest' && (
        <div className="sidebar-content">
          <div className="inspector-card">
            <div className="card-title">CUSTOM AUDIO INGESTION</div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Upload your voiceover track (.mp3, .wav) to establish project duration and waveform.
            </p>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={(e) => handleAudioFile(e.target.files[0])}
            />
            <button onClick={() => audioInputRef.current?.click()} className="btn btn-secondary">
              <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              {audioInfo ? 'Change Audio File' : 'Upload Audio File (.mp3, .wav)'}
            </button>
            {audioInfo && (
              <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                Loaded: {audioInfo.name} ({audioInfo.durationSec.toFixed(1)}s)
              </div>
            )}
          </div>

          <div className="inspector-card">
            <div className="card-title">TIMELINED TRANSCRIPT INGESTION</div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Upload your pre-aligned ground truth subtitles (.srt, .vtt, or word-level .json from Deepgram / ElevenLabs).
            </p>
            <input
              ref={transcriptInputRef}
              type="file"
              accept=".srt,.vtt,.json"
              style={{ display: 'none' }}
              onChange={(e) => handleTranscriptFile(e.target.files[0])}
            />
            <button onClick={() => transcriptInputRef.current?.click()} className="btn btn-secondary">
              <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {transcriptInfo ? 'Change Transcript' : 'Upload Transcript (.srt, .json)'}
            </button>
            {transcriptInfo && (
              <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                Loaded: {transcriptInfo.name} ({transcriptInfo.scenes.length} scenes)
              </div>
            )}
          </div>

          <button onClick={onLoadSample} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Restore Default 1990s Demo Data
          </button>
        </div>
      )}

      {/* Tab 3: Remotion Code & CLI */}
      {activeTab === 'code' && (
        <div className="sidebar-content">
          <div className="inspector-card">
            <div className="card-title">ACTIVE SCENE COMPONENT</div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Component: <code style={{ color: 'var(--accent-cyan)' }}>src/remotion/scenes/{scene?.componentFile || 'Scene.jsx'}</code>
            </p>
            <div className="code-snippet-box">
              {`// Pure mathematical Remotion frame animation
import { useCurrentFrame, interpolate, spring } from 'remotion';

export const ${scene?.componentFile?.replace('.jsx', '') || 'Scene'} = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, ${scene?.durationFrames || 180}], [0, Math.PI * 0.5]);
  return <div style={{ transform: \`rotate(\${rotation}rad)\` }}>...</div>;
};`}
            </div>
          </div>

          <div className="inspector-card">
            <div className="card-title">RENDER COMMAND</div>
            <div className="code-snippet-box" style={{ color: 'var(--accent-emerald)' }}>
              npx remotion render Root out/video.mp4 --props=./timeline.json
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
