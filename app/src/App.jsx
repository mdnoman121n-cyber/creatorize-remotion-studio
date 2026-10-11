import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { SidebarInspector } from './components/SidebarInspector';
import { Timeline } from './components/Timeline';
import { AIPromptModal } from './components/AIPromptModal';
import { ExportModal } from './components/ExportModal';
import { parseSubtitleText } from './utils/srtParser';

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
  const [activeTab, setActiveTab] = useState('scene'); // 'scene' | 'ingest' | 'code'

  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize Default Demo Project
  const loadDemoProject = () => {
    const demoScenes = parseSubtitleText(DEMO_SRT, projectConfig.fps);
    const totalFrames = demoScenes[demoScenes.length - 1]?.endFrame || 645;

    setAudioInfo({
      name: 'voiceover_1990s_boom.mp3',
      size: '1.42 MB',
      durationSec: totalFrames / projectConfig.fps,
      url: null
    });

    setTranscriptInfo({
      name: 'narration_timeline.srt',
      type: 'SRT Subtitles',
      scenes: demoScenes
    });

    setTimeline({
      projectId: '1990s-documentary',
      fps: projectConfig.fps,
      width: projectConfig.width,
      height: projectConfig.height,
      totalDurationFrames: totalFrames,
      audioFileName: 'voiceover_1990s_boom.mp3',
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
    if (timeline.scenes.length > 0) {
      const frames = Math.round(info.durationSec * projectConfig.fps);
      setTimeline((prev) => ({
        ...prev,
        totalDurationFrames: Math.max(frames, prev.totalDurationFrames || 0),
        audioFileName: info.name
      }));
    }
  };

  const handleTranscriptLoaded = (info) => {
    setTranscriptInfo(info);
    const totalFrames = info.scenes[info.scenes.length - 1]?.endFrame || 300;
    setTimeline({
      projectId: 'custom-' + Date.now(),
      fps: projectConfig.fps,
      width: projectConfig.width,
      height: projectConfig.height,
      totalDurationFrames: totalFrames,
      audioFileName: audioInfo?.name || 'audio.mp3',
      scenes: info.scenes
    });
    setCurrentFrame(0);
    setActiveSceneIndex(0);
    setActiveTab('scene');
  };

  const handleUpdateActiveScene = (updatedScene) => {
    const newScenes = [...timeline.scenes];
    newScenes[activeSceneIndex] = updatedScene;
    setTimeline({ ...timeline, scenes: newScenes });
  };

  const totalFrames = timeline.totalDurationFrames || 645;
  const activeScene = timeline.scenes[activeSceneIndex] || null;

  return (
    <div className="studio-root">
      {/* 1. TOP HEADER (Height: 56px) */}
      <Header
        projectConfig={projectConfig}
        setProjectConfig={setProjectConfig}
        onLoadSample={loadDemoProject}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* 2. MAIN CENTER STAGE (Canvas Viewport + Tabbed Sidebar) */}
      <div className="studio-main">
        {/* Left Viewport Player */}
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

        {/* Right Tabbed Inspector Sidebar */}
        <SidebarInspector
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          scene={activeScene}
          onUpdateScene={handleUpdateActiveScene}
          onOpenAIPrompt={() => setShowAIPromptModal(true)}
          projectConfig={projectConfig}
          audioInfo={audioInfo}
          transcriptInfo={transcriptInfo}
          onAudioLoaded={handleAudioLoaded}
          onTranscriptLoaded={handleTranscriptLoaded}
          onLoadSample={loadDemoProject}
        />
      </div>

      {/* 3. BOTTOM NON-LINEAR TIMELINE (Height: 220px) */}
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
        fps={projectConfig.fps}
      />

      {/* MODALS */}
      {showAIPromptModal && (
        <AIPromptModal
          scene={activeScene}
          projectConfig={projectConfig}
          onClose={() => setShowAIPromptModal(false)}
        />
      )}

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
