/**
 * Generates ready-to-paste AI agent prompt for a specific scene
 */
export function generateScenePrompt(scene, totalProjectConfig = { fps: 30, width: 1920, height: 1080 }) {
  const { fps } = totalProjectConfig;
  const durationSec = ((scene.endFrame - scene.startFrame) / fps).toFixed(2);

  const styleDirectives = {
    '3d-retro-ps1': `A 3D Retro PS1 / 90s Cyberspace aesthetic:
  - Wireframe cyber grid floor receding into the dark horizon.
  - Floating 3D geometric nodes or retro CRT computer monitor.
  - Subtle scanline overlay and dithered neon lighting (#6366f1, #06b6d4).
  - Continuous cinematic camera orbit tied to \`frame\`.`,
    
    'server-isometric': `A 3D Isometric Server Room aesthetic:
  - Isometric angle with server racks arranged in perspective.
  - Flashing green and amber status LEDs on rack faces.
  - Fiber-optic light pulses moving across the floor.
  - Subtle camera drift along the server corridor.`,

    'vox-collage': `A Vox-style 2.5D Archival Documentary Collage:
  - Textured dark paper background with subtle dust/grain.
  - Archival newspaper clippings and photography cutouts with drop shadows.
  - Parallax push-in effect: foreground layers scale 15% faster than background.
  - Red / yellow marker highlight animations over key phrases.`,

    'kinetic-text': `A High-Energy Kinetic Typography sequence:
  - Word-by-word active glow animation matching speech timestamps.
  - Bold sans-serif typography with dynamic scale bounce on stressed syllables.
  - Particle sparks or subtle background geometry reacting to the audio pace.`
  };

  const selectedDirective = styleDirectives[scene.visualTheme] || styleDirectives['3d-retro-ps1'];

  return `### Remotion Scene Implementation Task

You are an expert Remotion & Three.js developer working on a code-driven documentary video.
Please write the complete React component for **${scene.componentFile}** in \`src/remotion/scenes/\`.

---

#### 🎬 Scene Metadata & Constraints:
- **Scene Index**: Scene #${scene.index}
- **Spoken Narration**: "${scene.transcript}"
- **Global Start Frame**: ${scene.startFrame} (time: ${scene.startSec.toFixed(2)}s)
- **Global End Frame**: ${scene.endFrame} (time: ${scene.endSec.toFixed(2)}s)
- **Duration**: ${scene.durationFrames} frames (${durationSec} seconds at ${fps} FPS)
- **Resolution**: ${totalProjectConfig.width}x${totalProjectConfig.height}
- **Visual Style**: ${scene.visualTheme}

---

#### 🎨 Visual & Motion Directives:
${selectedDirective}

---

#### 📐 Remotion Strict Rules:
1. Drive ALL motion using \`useCurrentFrame()\`, \`interpolate()\`, and \`spring()\`.
2. NEVER use CSS transitions, keyframes, or \`setTimeout\`.
3. Frame 0 must begin seamlessly; frame ${scene.durationFrames} should ease out cleanly.
4. Export the component as default or named export matching \`${scene.componentFile.replace('.jsx', '')}\`.
5. Props received: \`{ durationInFrames, words }\`.

---

#### 💻 Starter Component Blueprint:
\`\`\`jsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const ${scene.componentFile.replace('.jsx', '')} = ({ durationInFrames = ${scene.durationFrames}, words = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 }
  });

  // Camera drift interpolation
  const cameraZ = interpolate(frame, [0, durationInFrames], [0, 40], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Visual Scene Content Here */}
      <div style={{ opacity: entrance, transform: \`scale(\${interpolate(frame, [0, durationInFrames], [0.95, 1.05])})\` }}>
        {/* Your 3D canvas / collage elements */}
      </div>
    </div>
  );
};
\`\`\`
`;
}
