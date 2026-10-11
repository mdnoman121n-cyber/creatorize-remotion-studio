import React from 'react';
import { Scene1_Intro3D } from './scenes/Scene1_Intro3D';
import { Scene2_ServerRoom } from './scenes/Scene2_ServerRoom';
import { Scene3_Collage } from './scenes/Scene3_Collage';
import { Scene4_Conclusion } from './scenes/Scene4_Conclusion';
import { Subtitles } from './Subtitles';

// Map scene identifiers or indices to component implementations
const SCENE_COMPONENTS = {
  'Scene1_Beat.jsx': Scene1_Intro3D,
  'Scene2_Beat.jsx': Scene2_ServerRoom,
  'Scene3_Beat.jsx': Scene3_Collage,
  'Scene4_Beat.jsx': Scene4_Conclusion,
  '3d-retro-ps1': Scene1_Intro3D,
  'server-isometric': Scene2_ServerRoom,
  'vox-collage': Scene3_Collage,
  'kinetic-text': Scene4_Conclusion
};

export const VideoComposition = ({
  currentFrame = 0,
  timeline = { scenes: [] },
  activeSceneIndex = 0
}) => {
  const { scenes = [] } = timeline;

  if (scenes.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#030712',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8' }}>
          No Audio or Transcript Loaded
        </div>
        <div style={{ fontSize: '13px', marginTop: '6px' }}>
          Upload your audio and SRT/JSON transcript to generate the video composition
        </div>
      </div>
    );
  }

  // Find the scene corresponding to currentFrame
  let currentScene = scenes.find(
    (s) => currentFrame >= s.startFrame && currentFrame <= s.endFrame
  );

  if (!currentScene) {
    currentScene = scenes[Math.min(activeSceneIndex, scenes.length - 1)] || scenes[0];
  }

  // Calculate local scene frame
  const sceneFrame = Math.max(0, currentFrame - currentScene.startFrame);

  // Lookup scene component
  const SceneComponent =
    SCENE_COMPONENTS[currentScene.componentFile] ||
    SCENE_COMPONENTS[currentScene.visualTheme] ||
    Scene1_Intro3D;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Active Scene Visual Renderer */}
      <SceneComponent
        durationInFrames={currentScene.durationFrames}
        sceneFrame={sceneFrame}
        words={currentScene.words}
      />

      {/* Kinetic Subtitles Track */}
      <Subtitles
        words={currentScene.words}
        currentGlobalFrame={currentFrame}
        currentSceneFrame={sceneFrame}
      />

      {/* Subtle HUD Overlay with Timecode */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 40,
          pointerEvents: 'none'
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "'Fira Code', monospace",
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '3px 8px',
            borderRadius: 4,
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}
        >
          SCENE {currentScene.index}/{scenes.length}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "'Fira Code', monospace",
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '3px 8px',
            borderRadius: 4,
            color: '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          FRAME {currentFrame}
        </span>
      </div>
    </div>
  );
};
