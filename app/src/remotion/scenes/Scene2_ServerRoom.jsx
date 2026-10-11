import React, { useRef, useEffect } from 'react';

/**
 * Scene 2: 3D Isometric Server Room
 * Narration: "By 1998, server rooms across Silicon Valley were overheating under unprecedented traffic."
 */
export const Scene2_ServerRoom = ({ durationInFrames = 171, sceneFrame = 0 }) => {
  const canvasRef = useRef(null);
  const progress = Math.min(1, Math.max(0, sceneFrame / durationInFrames));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Camera pan offset
    const panX = (progress - 0.5) * 80;
    const panY = (progress - 0.5) * 40;

    ctx.save();
    ctx.translate(panX, panY);

    // Draw Isometric Server Racks
    const drawServerRack = (x, y, rackWidth, rackHeight, rackDepth) => {
      // Front face
      ctx.fillStyle = '#111827';
      ctx.fillRect(x, y, rackWidth, rackHeight);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, rackWidth, rackHeight);

      // Top face (isometric skew)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + rackDepth, y - rackDepth * 0.5);
      ctx.lineTo(x + rackWidth + rackDepth, y - rackDepth * 0.5);
      ctx.lineTo(x + rackWidth, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right face
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(x + rackWidth, y);
      ctx.lineTo(x + rackWidth + rackDepth, y - rackDepth * 0.5);
      ctx.lineTo(x + rackWidth + rackDepth, y + rackHeight - rackDepth * 0.5);
      ctx.lineTo(x + rackWidth, y + rackHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Blinking LEDs & Server Units
      const units = 10;
      const unitHeight = rackHeight / units;
      for (let u = 0; u < units; u++) {
        const uy = y + u * unitHeight;
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x + 4, uy + 2, rackWidth - 8, unitHeight - 4);

        // LED lights
        const blink1 = Math.sin((sceneFrame + u * 13) * 0.4) > 0.1;
        const blink2 = Math.cos((sceneFrame + u * 17) * 0.5) > 0.2;
        const heatWarning = u > 7 && Math.sin(sceneFrame * 0.3) > 0;

        ctx.fillStyle = heatWarning ? '#ef4444' : (blink1 ? '#10b981' : '#047857');
        ctx.fillRect(x + 8, uy + 6, 4, 4);

        ctx.fillStyle = blink2 ? '#38bdf8' : '#0369a1';
        ctx.fillRect(x + 16, uy + 6, 4, 4);
      }
    };

    // Draw row of server racks
    const racks = [
      { x: 120, y: 140, w: 90, h: 260, d: 45 },
      { x: 260, y: 110, w: 90, h: 290, d: 45 },
      { x: 400, y: 80, w: 90, h: 320, d: 45 },
      { x: 540, y: 110, w: 90, h: 290, d: 45 },
      { x: 680, y: 140, w: 90, h: 260, d: 45 }
    ];

    racks.forEach(r => drawServerRack(r.x, r.y, r.w, r.h, r.d));

    // Heat haze / amber glow effect
    const heatGlow = ctx.createRadialGradient(450, 240, 50, 450, 240, 350);
    heatGlow.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
    heatGlow.addColorStop(0.6, 'rgba(249, 115, 22, 0.08)');
    heatGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = heatGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }, [progress, sceneFrame]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontFamily: "'Fira Code', monospace",
          fontSize: '12px',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
        THERMAL OVERLOAD // 1998 SILICON VALLEY
      </div>
    </div>
  );
};
