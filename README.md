# Creatorize Remotion Studio 🎬🤖

> **Code-driven AI Video Production Engine** modeled after the Creatorize workflow (by G Russ), powered by **Remotion**, **Three.js**, and local AI agents (**Claude Code**, **Antigravity**, **Cursor**, **Codex**).
> 
> **Key Enhancement**: Direct upload of custom audio with **user-provided timelined transcripts** (`.srt`, `.vtt`, `.json` with word-level timestamps) instead of relying solely on local Whisper transcription.

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Remotion](https://img.shields.io/badge/video%20engine-Remotion-purple.svg)](https://github.com/remotion-dev/remotion)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D-Three.js%20%2F%20R3F-black.svg)](https://threejs.org/)

---

## 🌟 Overview & Why This Exists

Traditional video production requires tedious manual keyframing in Premiere Pro or After Effects. Newer generative video tools (Sora, Runway Gen-3) hallucinate text, lack precise scene control, and burn costly cloud credits.

**Creatorize** revolutionized this space by proving that **pure code (React + Remotion + Three.js)** can produce breathtaking, faceless 3D documentary videos locally on your machine at **1080p/4K 60fps** with **zero render credits**:
- Every camera movement is a mathematical spring or interpolation.
- Every 3D server rack, retro PS1 computer, or Vox-style collage is a React component.
- Local AI coding assistants (**Claude**, **Antigravity**, **Codex**) can write, modify, and style each scene in seconds.

### 🎯 The Custom Transcript Enhancement
Standard implementations lock you into automatic local Whisper transcription, which frequently mishears technical jargon, mangles timestamps, or fails on accents.

**Creatorize Remotion Studio solves this** by allowing you to upload:
1. **Your voiceover audio** (`.mp3`, `.wav`)
2. **Your own timelined transcript** (`.srt`, `.vtt`, or word-level `.json` from Deepgram, ElevenLabs, WhisperX, or Descript).

The engine parses the timestamps down to exact video frame numbers (`frames = seconds * FPS`), creating a synchronized ground-truth timeline for your AI assistant to generate visuals against.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CREATORIZE REMOTION STUDIO UI                            │
│  ┌───────────────────────┐ ┌──────────────────────────────────────────────┐ │
│  │ Project & Media Setup │ │ Remotion Canvas / 3D Player Preview          │ │
│  │ • Audio Upload (.mp3) │ │ • 60fps scrubbable preview                   │ │
│  │ • Custom Transcript   │ │ • Live Three.js WebGL rendering              │ │
│  │   (SRT / VTT / JSON)  │ └──────────────────────────────────────────────┘ │
│  └───────────────────────┘ ┌──────────────────────────────────────────────┐ │
│  ┌───────────────────────┐ │ Multi-Track Interactive Timeline              │ │
│  │ AI Prompt Dispatcher  │ │ ──Audio Waveform Track─────────────────────  │ │
│  │ • Scene Prompt Copy   │ │ ──Scene Blocks [Scene 1] [Scene 2] [Scene 3] │ │
│  │ • Component Templates │ │ ──Word-level Kinetic Captions Track──────── │ │
│  └───────────────────────┘ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ Reads / Writes
┌──────────────────────────────────────▼───────────────────────────────────────┐
│                    PROJECT WORKSPACE (Local Disk)                            │
│  ├── timeline.json             (Normalized frames, cues, word timings)        │
│  ├── AGENTS.md                 (Directives & rules for local AI agents)       │
│  ├── public/audio.mp3          (Voiceover audio file)                        │
│  └── src/                                                                    │
│      ├── Root.jsx              (Remotion composition root)                   │
│      ├── scenes/               (Scene1.jsx, Scene2.jsx, Scene3.jsx...)       │
│      └── components/           (3D canvas, cameras, kinetic typography)      │
└──────────────────────────────────────▲───────────────────────────────────────┘
                                       │ Operates On
┌──────────────────────────────────────┴───────────────────────────────────────┐
│           LOCAL AI AGENTS (Claude Code, Antigravity, Cursor, Codex)          │
│  Reads timeline.json & AGENTS.md ───► Generates / Edits Scene Code           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v20+)
- **NPM** or **PNPM**
- Optional: Any local AI coding assistant (Claude Code CLI, Google Antigravity IDE, Cursor, Codex).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mdnoman121n-cyber/creatorize-remotion-studio.git
cd creatorize-remotion-studio

# Navigate to app directory
cd app

# Install dependencies (on Windows PowerShell, you can use npm.cmd if scripts are restricted)
npm install
# or: npm.cmd install

# Start the local studio server
npm run dev
# or: npm.cmd run dev
```

> **Windows PowerShell Tip:** If you see `File npm.ps1 cannot be loaded because running scripts is disabled`, either use `npm.cmd run dev` or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` in PowerShell.

Open `http://localhost:5173` in your browser.

---

## 🚀 How to Use

### Step 1: Upload Media & Custom Transcript
1. Drag and drop your voiceover audio file (`.mp3` or `.wav`).
2. Drag and drop your timelined transcript:
   - **SRT (`.srt`)**: Standard subtitle format.
   - **WebVTT (`.vtt`)**: Web subtitle format.
   - **Word-Level JSON (`.json`)**: Formatted with word, start time, and end time.
3. The app instantly parses all timings, computes durations in video frames (e.g. 30 FPS), and draws the interactive timeline and waveform.

### Step 2: Generate Prompts for Your AI Agent
1. Click on any scene block in the timeline.
2. Click **"Copy AI Prompt"**.
3. The prompt contains:
   - Target frame range (e.g., `startFrame: 0, endFrame: 180`).
   - The spoken dialogue.
   - Desired visual theme (3D retro PS1, Vox documentary collage, server room, etc.).
   - Remotion animation rules and code boilerplate.

### Step 3: Let AI Code the Scene
Paste the prompt into **Claude Code**, **Antigravity**, or **Cursor**. The AI will generate or edit the scene component (e.g. `src/remotion/scenes/Scene1_Intro3D.jsx`). Hot Module Replacement (HMR) refreshes the Remotion preview canvas immediately!

### Step 4: Export Final MP4
Click **"Export Video"** in the studio header to get the hardware-accelerated Remotion rendering command:
```bash
npx remotion render Root out/video.mp4 --props=./timeline.json
```

---

## 📁 Repository Structure

```
├── README.md                 # Main overview & quickstart
├── AGENTS.md                 # Instructions for AI assistants (Claude, Antigravity, Codex)
├── docs/
│   ├── ARCHITECTURE.md       # Technical architecture specification
│   ├── PLAN.md               # Step-by-step implementation blueprint
│   ├── AGENT_GUIDE.md        # Guide on prompting local coding agents
│   └── USER_GUIDE.md         # End-to-end production guide
├── sample-data/
│   ├── sample_narration.srt  # Sample SRT subtitle file
│   ├── sample_words.json     # Sample word-level timestamp JSON
│   └── sample_script.txt     # Sample voiceover script
└── app/
    ├── index.html            # Studio entrypoint
    ├── package.json          # Dependencies & scripts
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── main.jsx          # React DOM root
        ├── App.jsx           # Master Studio UI
        ├── index.css         # Modern dark-mode styling
        ├── components/       # Studio UI components
        ├── remotion/         # Remotion video scenes & compositions
        └── utils/            # Transcript parsers & time utilities
```

---

## 🤖 Supported Local AI Agents

- **Antigravity IDE**: Deep pair-programming, multi-file edits, and automated browser preview.
- **Claude Code**: Terminal CLI assistant for rapid scene generation.
- **Cursor**: Inline code editing with instant auto-complete.
- **OpenAI Codex / Copilot**: Code completion and boilerplate generation.

---

## 📜 License
MIT License. Created for the code-driven video creation community.
