import React, { useRef, useEffect } from 'react';

export const Timeline = ({
  timeline = { scenes: [] },
  currentFrame = 0,
  setCurrentFrame,
  totalFrames = 645,
  activeSceneIndex = 0,
  setActiveSceneIndex,
  onSceneSelect,
  fps = 30
}) => {
  const tracksAreaRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const { scenes = [] } = timeline;

  // Draw Audio Waveform simulation
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#080d19';
    ctx.fillRect(0, 0, width, height);

    const bars = 220;
    const barWidth = width / bars;
    const centerY = height * 0.5;

    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      const wave = Math.abs(Math.sin(i * 0.12) * 0.7 + Math.cos(i * 0.28) * 0.3);
      const barH = Math.max(4, wave * (height * 0.8));

      ctx.fillStyle = i % 2 === 0 ? '#4338ca' : '#6366f1';
      ctx.fillRect(x + 1, centerY - barH * 0.5, barWidth - 2, barH);
    }
  }, [totalFrames]);

  const handleTrackClick = (e) => {
    if (!tracksAreaRef.current) return;
    const rect = tracksAreaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetFrame = Math.round(ratio * totalFrames);
    setCurrentFrame(targetFrame);

    const matchingIndex = scenes.findIndex(
      (s) => targetFrame >= s.startFrame && targetFrame <= s.endFrame
    );
    if (matchingIndex !== -1) {
      setActiveSceneIndex(matchingIndex);
      onSceneSelect(scenes[matchingIndex]);
    }
  };

  const playheadPercent = (currentFrame / (totalFrames || 1)) * 100;
  const totalDurationSec = totalFrames / fps;

  // Generate 8-10 time ruler notches
  const rulerTicks = [];
  const tickCount = 10;
  for (let i = 0; i <= tickCount; i++) {
    const sec = ((i / tickCount) * totalDurationSec).toFixed(1);
    const leftPct = (i / tickCount) * 100;
    rulerTicks.push({ sec, leftPct });
  }

  const activeScene = scenes.find((s) => currentFrame >= s.startFrame && currentFrame <= s.endFrame) || scenes[0];

  return (
    <div className="studio-timeline">
      {/* Timeline Header Bar */}
      <div className="timeline-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>
          <svg className="icon-xs" style={{ color: 'var(--accent-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          NON-LINEAR MULTI-TRACK TIMELINE
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '11px' }}>
          {scenes.length} Scenes • {totalFrames} Frames • {totalDurationSec.toFixed(2)}s
        </div>
      </div>

      {/* Main Track Grid */}
      <div className="timeline-workspace">
        {/* Track Headers (Left fixed column) */}
        <div className="timeline-track-headers">
          <div className="track-header-item ruler-header">TIME</div>
          <div className="track-header-item audio-header">
            <span style={{ color: '#818cf8' }}>AUDIO / VOICE</span>
          </div>
          <div className="track-header-item scenes-header">
            <span style={{ color: '#38bdf8' }}>SCENE BEATS</span>
          </div>
          <div className="track-header-item captions-header">
            <span style={{ color: '#34d399' }}>CAPTIONS</span>
          </div>
        </div>

        {/* Tracks Area (Clickable & Scrubbable) */}
        <div ref={tracksAreaRef} onClick={handleTrackClick} className="timeline-tracks-area">
          {/* Track 1: Time Ruler */}
          <div className="timeline-ruler">
            {rulerTicks.map((tick, i) => (
              <div key={i} className="ruler-mark" style={{ left: `${tick.leftPct}%` }}>
                {tick.sec}s
              </div>
            ))}
          </div>

          {/* Track 2: Audio Waveform */}
          <div className="timeline-track-audio">
            <canvas ref={waveformCanvasRef} width={1200} height={50} className="audio-waveform-canvas" />
          </div>

          {/* Track 3: Scene Blocks */}
          <div className="timeline-track-scenes">
            {scenes.map((scene, idx) => {
              const startRatio = (scene.startFrame / (totalFrames || 1)) * 100;
              const widthRatio = ((scene.endFrame - scene.startFrame) / (totalFrames || 1)) * 100;
              const isSelected = activeSceneIndex === idx;

              return (
                <div
                  key={scene.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSceneIndex(idx);
                    setCurrentFrame(scene.startFrame);
                    onSceneSelect(scene);
                  }}
                  style={{
                    left: `${startRatio}%`,
                    width: `${Math.max(4, widthRatio)}%`
                  }}
                  className={`timeline-scene-block ${isSelected ? 'selected' : ''}`}
                >
                  <div className="scene-block-header">
                    <span>Scene {scene.index}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '9px' }}>{scene.durationFrames}f</span>
                  </div>
                  <div className="scene-block-text">{scene.transcript}</div>
                </div>
              );
            })}
          </div>

          {/* Track 4: Captions Track */}
          <div className="timeline-track-captions">
            <div className="active-caption-badge">
              {activeScene ? `❝ ${activeScene.transcript} ❞` : '—'}
            </div>
          </div>

          {/* Draggable Playhead */}
          <div className="timeline-playhead-line" style={{ left: `${playheadPercent}%` }}>
            <div className="playhead-head-flag" />
          </div>
        </div>
      </div>
    </div>
  );
};
