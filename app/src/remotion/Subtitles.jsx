import React from 'react';

/**
 * Word-level kinetic subtitle renderer
 */
export const Subtitles = ({ words = [], currentGlobalFrame = 0, currentSceneFrame = 0, style = {} }) => {
  if (!words || words.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '85%',
        maxWidth: 900,
        textAlign: 'center',
        zIndex: 50,
        pointerEvents: 'none',
        ...style
      }}
    >
      <div
        style={{
          display: 'inline-block',
          backgroundColor: 'rgba(8, 12, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '10px 24px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          fontSize: '22px',
          fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.5,
          letterSpacing: '-0.02em',
          color: '#e2e8f0'
        }}
      >
        {words.map((w, index) => {
          const isActive =
            (w.startFrame !== undefined && currentGlobalFrame >= w.startFrame && currentGlobalFrame <= w.endFrame);

          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                margin: '0 4px',
                transition: 'all 0.1s ease-out',
                color: isActive ? '#38bdf8' : '#94a3b8',
                transform: isActive ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
                textShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.8)' : 'none',
                fontWeight: isActive ? 800 : 600
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
