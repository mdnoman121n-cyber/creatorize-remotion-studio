import React, { useRef, useEffect } from 'react';
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
  const containerRef = useRef(null);

  // Playback timer loop
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

  const currentTimeSec = currentFrame / fps;
  const totalTimeSec = totalFrames / fps;

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top player bar */}
      <div className="h-10 bg-slate-950/80 border-b border-slate-800 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Remotion Live Canvas
          </span>
          <span className="font-mono text-slate-500">1920x1080 (16:9)</span>
        </div>

        {/* Timecodes */}
        <div className="flex items-center gap-4 font-mono">
          <span className="text-cyan-400 font-bold">{formatFrames(currentFrame, fps)}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{formatFrames(totalFrames, fps)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{formatTime(currentTimeSec)}</span>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full">
          <VideoComposition
            currentFrame={currentFrame}
            timeline={timeline}
            activeSceneIndex={activeSceneIndex}
          />
        </div>
      </div>

      {/* Control bar */}
      <div className="h-12 bg-slate-950/90 border-t border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Step Back 1 Frame */}
          <button
            onClick={handleStepBack}
            title="Step Back 1 Frame"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Step Forward 1 Frame */}
          <button
            onClick={handleStepForward}
            title="Step Forward 1 Frame"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>

        {/* Progress scrub bar */}
        <div className="flex-1 max-w-xl mx-6">
          <input
            type="range"
            min={0}
            max={totalFrames || 1}
            value={currentFrame}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrame(parseInt(e.target.value));
            }}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Quick jump */}
        <div className="text-xs text-slate-400 font-mono">
          {((currentFrame / (totalFrames || 1)) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
