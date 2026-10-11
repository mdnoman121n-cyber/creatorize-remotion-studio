# End-to-End User Production Guide

This guide walks you through producing a complete YouTube documentary-style video using Creatorize Remotion Studio.

---

## 🎙️ Step 1: Voiceover & Transcript Generation

### Generating Audio:
- Use **ElevenLabs**, **OpenAI TTS**, or your own recorded microphone voiceover.
- Save as high-quality `.mp3` or `.wav`.

### Generating a Timelined Transcript:
You have multiple options:
1. **ElevenLabs / WhisperX / Deepgram**: Export word-level timestamped `.json`.
2. **CapCut / Descript / Premiere**: Export subtitle file (`.srt` or `.vtt`).
3. **YouTube Subtitle Download**: Download your video's `.srt` file.

---

## 💻 Step 2: Launch Creatorize Remotion Studio

```bash
cd f:/Antigravity-OS/app
npm run dev
```
Open `http://localhost:5173` in Chrome or Edge.

---

## 🗂️ Step 3: Ingest Media

1. In the **Media Ingestion** panel, click **Upload Audio** or load the included **Sample Demo**.
2. Click **Upload Transcript** (`.srt`, `.vtt`, or `.json`).
3. The studio automatically synchronizes audio peaks with the timeline, clusters dialogue into scene cards, and calculates frame durations.

---

## 🎨 Step 4: Review and Customize Scenes

- Click on each scene card on the visual timeline.
- Select a visual theme:
  - **3D Retro PS1 / Cyberspace**: Great for tech and historical themes.
  - **Vox Collage & Archival Push-In**: Great for storytelling and documentary narratives.
  - **Isometric Tech Room**: Great for engineering, servers, and hardware topics.
  - **Kinetic Typography**: Great for high-energy hook segments.

---

## 🤖 Step 5: AI Code Generation

1. Click **Copy AI Prompt** on the selected scene.
2. In your coding assistant (Claude Code CLI, Google Antigravity, or Cursor), paste the prompt.
3. The AI creates the component in `app/src/remotion/scenes/`.
4. Check the live preview canvas to verify animation timing.

---

## 🚀 Step 6: Render to MP4

When all scenes are complete:
1. Click **Export Video** in the top bar.
2. Run the provided Remotion rendering command:
   ```bash
   npx remotion render Root out/final_video.mp4 --props=./timeline.json
   ```
3. Remotion spins up headless Chromium and outputs a pristine 1080p/4K 60fps MP4 file with zero compression artifacts!
