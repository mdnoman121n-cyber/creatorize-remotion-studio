import { parseTimestampToSeconds } from './timeUtils';

/**
 * Universal Subtitle Parser (SRT and WebVTT)
 */
export function parseSubtitleText(text, fps = 30) {
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  // Matches subtitle blocks
  const blockRegex = /(?:(\d+)\n)?(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})(?:[^\n]*)\n([\s\S]*?)(?=(?:\n\s*\n)|$)/g;
  
  const scenes = [];
  let match;
  let sceneIndex = 1;

  while ((match = blockRegex.exec(cleanText)) !== null) {
    const rawStart = match[2];
    const rawEnd = match[3];
    const content = match[4].replace(/<[^>]+>/g, '').trim(); // Strip HTML tags like <i>
    
    const startSec = parseTimestampToSeconds(rawStart);
    const endSec = parseTimestampToSeconds(rawEnd);
    const startFrame = Math.round(startSec * fps);
    const endFrame = Math.round(endSec * fps);
    const durationFrames = Math.max(1, endFrame - startFrame);

    // Approximate word timestamps within the cue if not explicitly provided
    const wordsRaw = content.split(/\s+/).filter(Boolean);
    const wordDurationSec = wordsRaw.length > 0 ? (endSec - startSec) / wordsRaw.length : 0;
    
    const words = wordsRaw.map((word, i) => {
      const wStartSec = startSec + i * wordDurationSec;
      const wEndSec = wStartSec + wordDurationSec;
      return {
        word,
        startSec: wStartSec,
        endSec: wEndSec,
        startFrame: Math.round(wStartSec * fps),
        endFrame: Math.round(wEndSec * fps)
      };
    });

    // Determine default visual style recommendation
    const visualStyles = ['3d-retro-ps1', 'server-isometric', 'vox-collage', 'kinetic-text'];
    const chosenStyle = visualStyles[(sceneIndex - 1) % visualStyles.length];

    scenes.push({
      id: `scene-${sceneIndex}`,
      index: sceneIndex,
      startSec,
      endSec,
      startFrame,
      endFrame,
      durationFrames,
      transcript: content,
      visualTheme: chosenStyle,
      componentFile: `Scene${sceneIndex}_Beat.jsx`,
      words
    });

    sceneIndex++;
  }

  return scenes;
}
