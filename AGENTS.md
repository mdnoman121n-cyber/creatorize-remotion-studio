# AGENTS.md — AI Agent Directives for Creatorize Video Generation

This file is automatically ingested by local AI coding assistants (**Claude Code**, **Google Antigravity IDE**, **Cursor**, and **OpenAI Codex**). Follow these strict rules and conventions when creating or editing video scenes in this project.

---

## 🎯 Primary Role

You are a creative technical director and motion graphics engineer. Your goal is to write clean, deterministic **React + Remotion + Three.js** scene components that sync precisely with user-provided voiceover narration and timestamped captions.

---

## 📐 Remotion Golden Rules

1. **Deterministic Frame Logic**:
   - **NEVER** use `setTimeout`, `setInterval`, `requestAnimationFrame`, or CSS transitions/keyframes for video animations.
   - **ALWAYS** drive animations using `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()` from `remotion`.
   - Every single visual property must be a pure mathematical function of `frame`.

2. **FPS & Duration Constraints**:
   - Video runs at `30 FPS` (or `60 FPS` if configured in `timeline.json`).
   - Each scene is encapsulated inside its own component and rendered via Remotion `<Sequence>` or `<Series>`.
   - The scene's duration is determined by `scene.endFrame - scene.startFrame`.
   - Inside a scene component, `useCurrentFrame()` starts at `0` for that sequence.

3. **Smooth Motion Patterns**:
   ```javascript
   import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

   export const MyScene = () => {
     const frame = useCurrentFrame();
     const { fps } = useVideoConfig();

     // Smooth spring entrance (0 to 1)
     const entrance = spring({
       frame,
       fps,
       config: { damping: 12, mass: 0.5, stiffness: 100 },
     });

     // Deterministic interpolation
     const scale = interpolate(frame, [0, 60], [0.8, 1.0], {
       extrapolateRight: 'clamp',
     });

     return (
       <div style={{ transform: `scale(${scale * entrance})` }}>
         {/* Visual content */}
       </div>
     );
   };
   ```

---

## 🎨 Supported Visual Styles

### 1. 3D Documentary / Retro PS1 Aesthetic (`Three.js`)
- Use `@react-three/fiber` or HTML5 3D canvas primitives.
- Camera rotation must be tied to `frame`:
  ```javascript
  const rotationY = interpolate(frame, [0, 180], [0, Math.PI * 0.5]);
  ```
- Wireframes, dark atmospheric lighting (`#0f172a`), neon grid floors, floating data particles, low-poly isometric servers.

### 2. Vox-Style Archival Collage
- Paper cutout textures, archival newspaper clippings, black & white photos with colored accents.
- 2.5D Parallax camera push:
  - Background moves slowly (`interpolate(frame, [0, 120], [1.0, 1.05])`).
  - Foreground subject moves faster (`interpolate(frame, [0, 120], [1.0, 1.15])`).
  - Drop shadows (`box-shadow: 0 20px 40px rgba(0,0,0,0.6)`).

### 3. Kinetic Word-by-Word Typography
- Syllable/word glow synchronized with `scene.words` timestamps.
- Highlight active words based on:
  ```javascript
  const isActive = currentGlobalFrame >= word.startFrame && currentGlobalFrame <= word.endFrame;
  ```

---

## 📂 File Organization

- Scene files live in: `app/src/remotion/scenes/`
- Component naming convention: `Scene{Number}_{Description}.jsx` (e.g. `Scene1_Intro3D.jsx`, `Scene2_Collage.jsx`)
- Composition root: `app/src/remotion/Root.jsx`
- Shared utilities & 3D helpers: `app/src/remotion/components/`

---

## ⚡ Prompt Format for Scenes

When a user requests a scene:
1. Check the spoken narration in `timeline.json`.
2. Inspect `startFrame` and `endFrame`.
3. Create visually rich, layered graphics (background grid, primary 3D/collage subject, secondary floating elements, and subtitle overlay).
4. Always test that `frame = 0` starts cleanly and `frame = durationInFrames` ends gracefully or transitions into the next shot.
