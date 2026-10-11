# Technical Architecture Specification

## 1. System Topology

Creatorize Remotion Studio connects four major subsystems:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. MEDIA & TRANSCRIPT INGESTION SUBSYSTEM                                   │
│    • Audio decoder (Web Audio API / AudioContext)                           │
│    • Multi-format Transcript Parsers (SRT, WebVTT, Word-Level JSON)         │
│    • Frame synchronizer (seconds * target_fps -> frame_number)              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. TIMELINE & STATE ENGINE                                                  │
│    • Normalized timeline representation (timeline.json)                     │
│    • Multi-track sequence manager (Audio, Scenes, Captions)                 │
│    • Scene partitioner & marker split/merge algorithm                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 3. REMOTION VIDEO RENDERING SUBSYSTEM                                       │
│    • Real-time scrubbable Canvas / Remotion Player preview                  │
│    • WebGL / Three.js 3D viewport with frame-linked orbital camera          │
│    • Parallax 2.5D documentary collage compositor                           │
│    • Microsecond-accurate kinetic typography renderer                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 4. AI AGENT CONTEXT & CODE GENERATION PIPELINE                              │
│    • Dynamic prompt synthesizer with exact frame & visual constraints       │
│    • Code template library (Three.js shaders, spring curves, typography)     │
│    • Hot Module Reloading (Vite HMR) for instant preview feedback           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Ingestion Subsystem: Custom Audio & Timelined Transcript

### 2.1 Audio Ingestion
- Reads `.mp3` or `.wav` via FileReader as `ArrayBuffer`.
- Decodes audio data with `AudioContext.decodeAudioData()`.
- Extracts downsampled peak data for canvas waveform visualization (typically 200–800 peak samples per timeline zoom level).
- Extracts total duration: `durationSec = audioBuffer.duration`.

### 2.2 Transcript Parsing & Normalization
The engine supports three major ingestion formats and converts them into a unified internal model:

#### A. SubRip Subtitles (`.srt`)
```regex
/(\d+)\r?\n(\d{2}:\d{2}:\d{2}[,\.]\d{3}) --> (\d{2}:\d{2}:\d{2}[,\.]\d{3})\r?\n([\s\S]*?)(?=\r?\n\r?\n|\r?\n*$)/g
```
- Converts timestamps `HH:MM:SS,mmm` to seconds.
- Computes `startFrame = Math.round(startSec * fps)`.
- Computes `endFrame = Math.round(endSec * fps)`.

#### B. WebVTT (`.vtt`)
- Handles `WEBVTT` header, identifier lines, cue settings, and timestamp delimiters `HH:MM:SS.mmm`.

#### C. Word-Level Timed JSON (`.json`)
- Ingests payloads produced by WhisperX, Deepgram, ElevenLabs, or Descript.
- Schema:
  ```json
  [
    { "word": "In", "start": 0.00, "end": 0.28 },
    { "word": "1994", "start": 0.32, "end": 0.85 }
  ]
  ```
- Groups adjacent words into natural sentence blocks while preserving exact word timings for kinetic subtitle rendering.

---

## 3. Normalized `timeline.json` Specification

```typescript
export interface NormalizedWord {
  word: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export interface NormalizedScene {
  id: string;
  index: number;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
  transcript: string;
  visualTheme: '3d-retro-ps1' | 'vox-collage' | 'server-isometric' | 'data-map' | 'kinetic-text';
  componentFile: string;
  words: NormalizedWord[];
}

export interface ProjectTimeline {
  projectId: string;
  fps: number;
  width: number;
  height: number;
  totalDurationSec: number;
  totalDurationFrames: number;
  audioFileName: string;
  scenes: NormalizedScene[];
}
```

---

## 4. Headless Remotion Export Pipeline

To generate the final high-definition video file:
1. The project writes `timeline.json` into the root directory.
2. Remotion evaluates `<Composition>` in headless Chromium.
3. Audio is piped into `<Audio src={staticFile("audio.mp3")} />`.
4. Output is rendered via `@remotion/renderer` using H.264 / ProRes:
   ```bash
   npx remotion render Root out/video.mp4 --props=./timeline.json --concurrency=8
   ```
