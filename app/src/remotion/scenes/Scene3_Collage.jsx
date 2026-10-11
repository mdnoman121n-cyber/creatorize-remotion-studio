import React from 'react';

/**
 * Scene 3: Vox-style 2.5D Documentary Collage
 * Narration: "Dot-com startups were burning millions on billboard ads and fiber optic infrastructure."
 */
export const Scene3_Collage = ({ durationInFrames = 174, sceneFrame = 0 }) => {
  const progress = Math.min(1, Math.max(0, sceneFrame / durationInFrames));

  // Parallax scales
  const bgScale = 1.0 + progress * 0.05;
  const card1Scale = 1.0 + progress * 0.12;
  const card2Scale = 1.0 + progress * 0.18;
  const card3Scale = 1.0 + progress * 0.22;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0c0a09',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background textured grid & dark archival paper */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(41, 37, 36, 0.7) 0%, rgba(12, 10, 9, 1) 100%)',
          transform: `scale(${bgScale})`,
          transition: 'transform 0.05s linear'
        }}
      />

      {/* Floating Stock Certificate / Newspaper Clipping 1 */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '12%',
          width: '320px',
          padding: '16px',
          backgroundColor: '#fafaf9',
          color: '#1c1917',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.75)',
          borderRadius: '4px',
          transform: `rotate(-6deg) scale(${card1Scale}) translate(${progress * -15}px, ${progress * 10}px)`,
          border: '1px solid #d6d3d1'
        }}
      >
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#78716c', marginBottom: '4px' }}>
          Silicon Chronicle • March 1999
        </div>
        <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'serif', lineHeight: 1.2, marginBottom: '8px' }}>
          "STARTUPS SURGE 400% ON IPO DEBUT"
        </div>
        <div style={{ height: '4px', backgroundColor: '#eab308', width: '70%', marginBottom: '8px' }} />
        <div style={{ fontSize: '11px', color: '#57534e', lineHeight: 1.4 }}>
          Valuations skyrocket as venture funds inject record-breaking capital into fiber optic networks.
        </div>
      </div>

      {/* Floating Cash Burn Graphic / Card 2 */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          right: '14%',
          width: '280px',
          padding: '20px',
          backgroundColor: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '8px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.85)',
          transform: `rotate(4deg) scale(${card2Scale}) translate(${progress * 20}px, ${progress * -15}px)`,
          color: '#f4f4f5'
        }}
      >
        <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>MONTHLY CASH BURN</div>
        <div style={{ fontSize: '36px', fontWeight: 800, color: '#ef4444', fontFamily: "'Fira Code', monospace" }}>
          -${(1.2 + progress * 2.8).toFixed(1)}M
        </div>
        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
          ▲ 320% vs Previous Quarter
        </div>
      </div>

      {/* Centerpiece: Vintage Billboards / Fiber Optic Cutout */}
      <div
        style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '4px dashed rgba(234, 179, 8, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${card3Scale}) rotate(${progress * 20}deg)`,
          backgroundColor: 'rgba(234, 179, 8, 0.05)'
        }}
      >
        <div style={{ textAlign: 'center', color: '#facc15' }}>
          <div style={{ fontSize: '42px', fontWeight: 900 }}>.COM</div>
          <div style={{ fontSize: '12px', letterSpacing: '0.2em' }}>THE BOOM</div>
        </div>
      </div>

      {/* Film grain vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.85)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
