import React, { useRef, useEffect } from 'react';

export const Timeline = ({
  timeline = { scenes: [] },
  currentFrame = 0,
  setCurrentFrame,
  totalFrames = 600,
  activeSceneIndex = 0,
  setActiveSceneIndex,
  onSceneSelect
}) => {
  const containerRef = useRef(null);
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

    // Subtle background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    // Draw audio peaks
    const bars = 180;
    const barWidth = width / bars;
    const centerY = height * 0.5;

    for (let i = 0; i < bars; i++) {
      const x = i * barWidth;
      // Perlin-like pseudo audio peak
      const val = Math.abs(Math.sin(i * 0.15) * 0.6 + Math.cos(i * 0.35) * 0.4);
      const h = Math.max(3, val * (height * 0.8));

      ctx.fillStyle = i % 2 === 0 ? '#4338ca' : '#6366f1';
      ctx.fillRect(x + 1, centerY - h * 0.5, barWidth - 2, h);
    }
  }, [totalFrames]);

  const handleTimelineClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetFrame = Math.round(ratio * totalFrames);
    setCurrentFrame(targetFrame);

    // Also select corresponding scene
    const matchingIndex = scenes.findIndex(
      (s) => targetFrame >= s.startFrame && targetFrame <= s.endFrame
    );
    if (matchingIndex !== -1) {
      setActiveSceneIndex(matchingIndex);
      onSceneSelect(scenes[matchingIndex]);
    }
  };

  const playheadPercent = (currentFrame / (totalFrames || 1)) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Multi-Track Narrative Timeline
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Total Duration: {totalFrames} Frames ({scenes.length} Scenes)
        </span>
      </div>

      {/* Interactive Timeline Container */}
      <div
        ref={containerRef}
        onClick={handleTimelineClick}
        className="relative select-none cursor-pointer bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col"
        style={{ height: '150px' }}
      >
        {/* Track 1: Audio Waveform */}
        <div className="h-12 w-full relative border-b border-slate-900/80">
          <canvas
            ref={waveformCanvasRef}
            width={1000}
            height={48}
            className="w-full h-full object-cover opacity-80"
          />
          <span className="absolute top-1 left-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            AUDIO TRACK
          </span>
        </div>

        {/* Track 2: Scene Blocks */}
        <div className="h-14 w-full relative flex border-b border-slate-900/80 bg-slate-950/40">
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
                  width: `${widthRatio}%`,
                  position: 'absolute',
                  height: '100%'
                }}
                className={`p-1.5 transition border-r border-slate-800 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-600/30 border-y-2 border-y-indigo-400'
                    : 'bg-slate-900/80 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-semibold">
                  <span className={isSelected ? 'text-indigo-300' : 'text-slate-400'}>
                    Scene {scene.index}
                  </span>
                  <span className="text-[9px] text-slate-500">{scene.durationFrames}f</span>
                </div>
                <div className="text-[10px] text-slate-300 truncate font-sans">
                  {scene.transcript}
                </div>
              </div>
            );
          })}
        </div>

        {/* Track 3: Subtitles Overview */}
        <div className="h-8 w-full relative bg-slate-950/80 flex items-center px-2">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mr-2">
            CAPTIONS
          </span>
          <div className="text-[10px] text-cyan-300/80 truncate">
            {scenes.find((s) => currentFrame >= s.startFrame && currentFrame <= s.endFrame)
              ?.transcript || '—'}
          </div>
        </div>

        {/* Playhead Line */}
        <div
          style={{ left: `${playheadPercent}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] z-30 pointer-events-none"
        >
          <div className="w-3 h-3 bg-rose-500 -ml-[5px] -mt-1 rounded-sm rotate-45 shadow-md" />
        </div>
      </div>
    </div>
  );
};
