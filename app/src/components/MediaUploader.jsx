import React, { useRef, useState } from 'react';
import { parseSubtitleText } from '../utils/srtParser';
import { parseWordLevelJson } from '../utils/jsonTranscriptParser';

export const MediaUploader = ({ onAudioLoaded, onTranscriptLoaded, audioInfo, transcriptInfo, fps = 30 }) => {
  const audioInputRef = useRef(null);
  const transcriptInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleAudioFile = (file) => {
    if (!file) return;
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio();
    audio.src = audioUrl;

    audio.onloadedmetadata = () => {
      onAudioLoaded({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        durationSec: audio.duration,
        url: audioUrl,
        file
      });
    };
  };

  const handleTranscriptFile = (file) => {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      try {
        let scenes = [];
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          scenes = parseWordLevelJson(json, fps);
        } else {
          // SRT or VTT
          scenes = parseSubtitleText(text, fps);
        }

        onTranscriptLoaded({
          name: file.name,
          type: file.name.endsWith('.json') ? 'Word-Level Timed JSON' : 'SRT / VTT Subtitles',
          scenes
        });
      } catch (err) {
        alert('Failed to parse transcript: ' + err.message);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Media & Timelined Transcript Ingestion
        </h2>
        <span className="text-[11px] text-cyan-400 font-mono">Custom Ground Truth Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Audio File Box */}
        <div
          onClick={() => audioInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-lg p-3 transition flex items-center gap-3 ${
            audioInfo
              ? 'border-indigo-500/50 bg-indigo-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
          }`}
        >
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/mp3,audio/wav,audio/m4a,audio/*"
            className="hidden"
            onChange={(e) => handleAudioFile(e.target.files[0])}
          />
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {audioInfo ? audioInfo.name : 'Upload Voiceover Audio'}
            </div>
            <div className="text-[11px] text-slate-500">
              {audioInfo
                ? `${audioInfo.durationSec.toFixed(1)}s • ${audioInfo.size}`
                : '.mp3, .wav, or microphone track'}
            </div>
          </div>
        </div>

        {/* Custom Timelined Transcript Box */}
        <div
          onClick={() => transcriptInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-lg p-3 transition flex items-center gap-3 ${
            transcriptInfo
              ? 'border-cyan-500/50 bg-cyan-500/5'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
          }`}
        >
          <input
            ref={transcriptInputRef}
            type="file"
            accept=".srt,.vtt,.json"
            className="hidden"
            onChange={(e) => handleTranscriptFile(e.target.files[0])}
          />
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {transcriptInfo ? transcriptInfo.name : 'Upload Timelined Transcript'}
            </div>
            <div className="text-[11px] text-slate-500">
              {transcriptInfo
                ? `${transcriptInfo.scenes.length} Scenes detected (${transcriptInfo.type})`
                : '.srt, .vtt, or word-level .json'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
