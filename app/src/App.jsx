import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MediaUploader } from './components/MediaUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { SceneInspector } from './components/SceneInspector';
import { AIPromptModal } from './components/AIPromptModal';
import { ExportModal } from './components/ExportModal';
import { parseSubtitleText } from './utils/srtParser';

// Built-in documentary demo sample script
const DEMO_SRT = `1
00:00:00,000 --> 00:00:04,500
In the early 1990s, the internet was an empty frontier waiting for its first pioneers.

2
00:00:04,500 --> 00:00:10,200
By 1998, server rooms across Silicon Valley were overheating under unprecedented traffic.

3
00:00:10,200 --> 00:00:16,000
Dot-com startups were burning millions on billboard ads and fiber optic infrastructure.

4
00:00:16,000 --> 00:00:21,500
And yet, amidst the chaos, the modern digital architecture we rely on today was born.`;

export default function App() {
  const [projectConfig, setProjectConfig] = useState({
    fps: 30,
    width: 1920,
    height: 1080
  });

  const [audioInfo, setAudioInfo] = useState(null);
  const [transcriptInfo, setTranscriptInfo] = useState(null);
  const [timeline, setTimeline] = useState({ scenes: [] });

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Load demo project by default so the studio is immediately alive and interactive
  const loadDemoProject = () => {
    const demoScenes = parseSubtitleText(DEMO_SRT, projectConfig.fps);
    const totalFrames = demoScenes[demoScenes.length - 1]?.endFrame || 645;

    setAudioInfo({
      name: 'voiceover_1990s_internet_boom.mp3',
      size: '1.42 MB',
      durationSec: totalFrames / projectConfig.fps,
      url: null
    });

    setTranscriptInfo({
      name: 'narration_timeline.srt',
      type: 'SRT / VTT Subtitles',
      scenes: demoScenes
    });

    setTimeline({
      projectId: 'demo-1990s-documentary',
      fps: projectConfig.fps,
      width: projectConfig.width,
      height: projectConfig.height,
      totalDurationFrames: totalFrames,
      audioFileName: 'voiceover_1990s_internet_boom.mp3',
      scenes: demoScenes
    });

    setCurrentFrame(0);
    setActiveSceneIndex(0);
  };

  useEffect(() => {
    loadDemoProject();
  }, [projectConfig.fps]);

  const handleAudioLoaded = (info) => {
    setAudioInfo(info);
    // If we have scenes, update total duration
    if (timeline.scenes.length > 0) {
      const audioDurationFrames = Math.round(info.durationSec * projectConfig.fps);
      setTimeline((prev) => ({
        ...prev,
        totalDurationFrames: Math.max(audioDurationFrames, prev.totalDurationFrames || 0),
        audioFileName: info.name
      }));
    }
  };

  const handleTranscriptLoaded = (info) => {
    setTranscriptInfo(info);
    const totalFrames = info.scenes[info.scenes.length - 1]?.endFrame || 300;
    setTimeline({
      projectId: 'custom-project-' + Date.now(),
      fps: projectConfig.fps,
      width: projectConfig.width,
      height: projectConfig.height,
      totalDurationFrames: totalFrames,
      audioFileName: audioInfo?.name || 'audio.mp3',
      scenes: info.scenes
    });
    setCurrentFrame(0);
    setActiveSceneIndex(0);
  };

  const handleUpdateActiveScene = (updatedScene) => {
    const newScenes = [...timeline.scenes];
    newScenes[activeSceneIndex] = updatedScene;
    setTimeline({ ...timeline, scenes: newScenes });
  };

  const totalFrames = timeline.totalDurationFrames || 645;
  const activeScene = timeline.scenes[activeSceneIndex] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        projectConfig={projectConfig}
        setProjectConfig={setProjectConfig}
        onLoadSample={loadDemoProject}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1720px] mx-auto w-full">
        {/* Left Column: Video Viewport & Interactive Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Remotion Canvas Video Player */}
          <VideoPlayer
            currentFrame={currentFrame}
            setCurrentFrame={setCurrentFrame}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            totalFrames={totalFrames}
            fps={projectConfig.fps}
            timeline={timeline}
            activeSceneIndex={activeSceneIndex}
          />

          {/* Multi-Track Timeline */}
          <Timeline
            timeline={timeline}
            currentFrame={currentFrame}
            setCurrentFrame={setCurrentFrame}
            totalFrames={totalFrames}
            activeSceneIndex={activeSceneIndex}
            setActiveSceneIndex={setActiveSceneIndex}
            onSceneSelect={(scene) => {
              const idx = timeline.scenes.findIndex((s) => s.id === scene.id);
              if (idx !== -1) setActiveSceneIndex(idx);
            }}
          />
        </div>

        {/* Right Column: Ingestion & Scene Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Media & Custom Transcript Ingestion Card */}
          <MediaUploader
            audioInfo={audioInfo}
            transcriptInfo={transcriptInfo}
            fps={projectConfig.fps}
            onAudioLoaded={handleAudioLoaded}
            onTranscriptLoaded={handleTranscriptLoaded}
          />

          {/* Scene Inspector & AI Prompt Dispatcher */}
          <div className="flex-1">
            <SceneInspector
              scene={activeScene}
              projectConfig={projectConfig}
              onUpdateScene={handleUpdateActiveScene}
              onOpenAIPrompt={() => setShowAIPromptModal(true)}
            />
          </div>
        </div>
      </main>

      {/* AI Prompt Generator Modal */}
      {showAIPromptModal && (
        <AIPromptModal
          scene={activeScene}
          projectConfig={projectConfig}
          onClose={() => setShowAIPromptModal(false)}
        />
      )}

      {/* Remotion Render & Export Modal */}
      {showExportModal && (
        <ExportModal
          timeline={timeline}
          projectConfig={projectConfig}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
