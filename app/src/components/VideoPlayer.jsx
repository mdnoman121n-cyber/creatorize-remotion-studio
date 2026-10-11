import React, { useEffect } from 'react';
import { VideoComposition } from '../remotion/Root';
import { formatFrames, formatTime } from '../utils/timeUtils';

export const VideoPlayer = ({
  currentFrame,
  setCurrentFrame,
  isPlaying,
  setIsPlaying,
  totalFrames,
  fps,
  timeline,
  activeSceneIndex
}) => {
  // Real-time playback frame ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames, fps, setCurrentFrame, setIsPlaying]);

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.min(totalFrames, prev + 1));
  };

  const handleSkipStart = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleSkipEnd = () => {
    setIsPlaying(false);
    setCurrentFrame(totalFrames);
  };

  const currentTimeSec = currentFrame / fps;
  const totalTimeSec = totalFrames / fps;
  const currentScene = timeline.scenes?.[activeSceneIndex];

  return (
    <div className="viewport-panel">
      {/* Top Viewport Header */}
      <div className="viewport-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#e2e8f0' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            REMOTION LIVE CANVAS
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '11px' }}>
            1920×1080 (16:9)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentScene && (
            <span style={{ color: 'var(--accent-indigo)', fontWeight: 600, fontSize: '11px' }}>
              SCENE {currentScene.index}: {currentScene.transcript.slice(0, 40)}...
            </span>
          )}
          <div className="timecode-display">
            <span className="tc-active">{formatFrames(currentFrame, fps)}</span>
            <span className="tc-dim">/</span>
            <span>{formatFrames(totalFrames, fps)}</span>
            <span className="tc-dim">|</span>
            <span style={{ color: '#cbd5e1' }}>{formatTime(currentTimeSec)}</span>
          </div>
        </div>
      </div>

      {/* Center 16:9 Stage */}
      <div className="viewport-stage-wrap">
        <div className="canvas-frame">
          <VideoComposition
            currentFrame={currentFrame}
            timeline={timeline}
            activeSceneIndex={activeSceneIndex}
          />
        </div>
      </div>

      {/* Bottom Transport Controls Bar */}
      <div className="viewport-controls-bar">
        {/* Playback Transport Buttons */}
        <div className="transport-buttons">
          <button onClick={handleSkipStart} className="transport-btn" title="Skip to Beginning">
            <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button onClick={handleStepBack} className="transport-btn" title="Previous Frame (Left Arrow)">
            <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="transport-btn play-btn"
            title={isPlaying ? 'Pause' : 'Play (Spacebar)'}
          >
            {isPlaying ? (
              <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="icon-sm" style={{ transform: 'translateX(1px)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button onClick={handleStepForward} className="transport-btn" title="Next Frame (Right Arrow)">
            <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button onClick={handleSkipEnd} className="transport-btn" title="Skip to End">
            <svg className="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Live Scrubber Slider */}
        <input
          type="range"
          min={0}
          max={totalFrames || 1}
          value={currentFrame}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentFrame(parseInt(e.target.value));
          }}
          className="scrubber-slider"
        />

        {/* Progress Percentage */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', minWidth: '45px', textAlign: 'right' }}>
          {((currentFrame / (totalFrames || 1)) * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};
