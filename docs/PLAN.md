# Implementation Plan & Blueprint

## Phase 1: Ingestion & Timeline Normalization Engine
- [x] Ingest user audio files (`.mp3`, `.wav`) and compute audio duration & waveform peaks.
- [x] Universal transcript parser supporting `.srt`, `.vtt`, and word-level `.json`.
- [x] Real-time frame synchronization based on customizable project frame rates (24, 30, 60 FPS).
- [x] Automatic scene clustering based on pause thresholds or sentence boundaries.

## Phase 2: Interactive Web Studio & Remotion Player
- [x] Scrubbable video canvas with real-time frame playhead.
- [x] Multi-track visual timeline:
  - Audio waveform canvas
  - Color-coded scene segmentation blocks
  - Word-by-word subtitle track with active word highlight
- [x] Scene inspector allowing inline adjustments to duration, theme, and prompts.

## Phase 3: Visual Styles & Motion Graphics Library
- [x] **3D Isometric / Retro PS1 Style**: WebGL canvas with rotating camera, neon grid floor, floating 3D cubes, and cybernetic aesthetic.
- [x] **Vox Documentary Collage**: Parallax 2.5D newspaper cutout, archival photo push-in, and film grain overlay.
- [x] **Kinetic Subtitles**: Microsecond-synchronized typography with word pop and active accent colors.
- [x] **Data Visualizer**: Smooth counters and technical HUD elements.

## Phase 4: Local AI Agent Integration (Claude, Antigravity, Cursor, Codex)
- [x] `AGENTS.md` context anchor for workspace initialization.
- [x] Context-aware prompt generator tailored for each scene's frame constraints.
- [x] TypeScript / JSX component scaffolding allowing instant AI code injection.

## Phase 5: Export & Render Pipeline
- [x] Export config generator for Remotion CLI.
- [x] `timeline.json` persistence and project bundling.
- [x] GitHub repository synchronization and documentation suite.
