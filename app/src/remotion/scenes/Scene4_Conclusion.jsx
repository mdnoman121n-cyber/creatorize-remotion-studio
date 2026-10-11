import React, { useRef, useEffect } from 'react';

/**
 * Scene 4: Modern Cloud Topology & Kinetic Typography Conclusion
 * Narration: "And yet, amidst the chaos, the modern digital architecture we rely on today was born."
 */
export const Scene4_Conclusion = ({ durationInFrames = 165, sceneFrame = 0 }) => {
  const canvasRef = useRef(null);
  const progress = Math.min(1, Math.max(0, sceneFrame / durationInFrames));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear dark canvas
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    // Network constellation nodes
    const nodeCount = 24;
    const nodes = [];
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + progress * 0.5;
      const radius = 100 + ((i * 37) % 120);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * (radius * 0.6);
      nodes.push({ x, y });
    }

    // Draw connecting edges
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((n, idx) => {
      const glow = Math.sin((sceneFrame + idx * 10) * 0.1) * 2;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3 + glow, 0, Math.PI * 2);
      ctx.fill();
    });

    // Central pulsing core
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 80 + progress * 20);
    coreGrad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    coreGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.3)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.fill();
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
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <span
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: '11px',
            color: '#38bdf8',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}
        >
          // THE NEW PARADIGM
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '36px',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.03em',
            marginTop: '12px'
          }}
        >
          Modern Architecture Born
        </h2>
      </div>
    </div>
  );
};
