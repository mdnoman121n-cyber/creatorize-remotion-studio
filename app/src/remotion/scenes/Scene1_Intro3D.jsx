import React, { useRef, useEffect } from 'react';

/**
 * Scene 1: 3D Retro Cyberspace & Wireframe Frontier
 * Narration: "In the early 1990s, the internet was an empty frontier waiting for its first pioneers."
 */
export const Scene1_Intro3D = ({ durationInFrames = 135, sceneFrame = 0 }) => {
  const canvasRef = useRef(null);

  // Normalized progress (0 to 1)
  const progress = Math.min(1, Math.max(0, sceneFrame / durationInFrames));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    // Dynamic horizon and camera movement
    const horizonY = height * 0.55;
    const speed = progress * 600;

    // Draw perspective grid floor
    ctx.save();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 1.5;

    // Perspective converging lines
    const fovX = width * 0.5;
    for (let x = -width * 1.5; x <= width * 2.5; x += 60) {
      ctx.beginPath();
      ctx.moveTo(fovX, horizonY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal moving grid lines (infinite scroll simulation)
    for (let i = 0; i < 16; i++) {
      const z = ((i * 30 + speed) % 400) / 400;
      const y = horizonY + Math.pow(z, 2.2) * (height - horizonY);
      const alpha = z * 0.7;
      ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Draw glowing digital sun / data core
    const sunRadius = 70 + Math.sin(progress * Math.PI) * 10;
    const gradient = ctx.createRadialGradient(fovX, horizonY - 40, 10, fovX, horizonY - 40, sunRadius * 1.8);
    gradient.addColorStop(0, 'rgba(238, 242, 255, 0.95)');
    gradient.addColorStop(0.3, 'rgba(129, 140, 248, 0.8)');
    gradient.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(fovX, horizonY - 40, sunRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Draw retro scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }
  }, [progress, sceneFrame]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Title overlay with vintage terminal typography */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: `translateX(-50%) translateY(${Math.sin(progress * 3) * 5}px)`,
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            borderRadius: '4px',
            color: '#a5b4fc',
            fontFamily: "'Fira Code', monospace",
            fontSize: '12px',
            letterSpacing: '0.15em',
            marginBottom: '8px'
          }}
        >
          // CHAPTER 01: THE 1990s FRONTIER
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '32px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 24px rgba(0,0,0,0.8)'
          }}
        >
          The Uncharted Frontier
        </h2>
      </div>
    </div>
  );
};
