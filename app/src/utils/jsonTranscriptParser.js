/**
 * Word-level JSON Transcript Parser (WhisperX, Deepgram, ElevenLabs, Descript format)
 */
export function parseWordLevelJson(jsonData, fps = 30, pauseThresholdSec = 0.6) {
  let wordList = [];

  // Normalize different JSON formats
  if (Array.isArray(jsonData)) {
    wordList = jsonData;
  } else if (jsonData.words && Array.isArray(jsonData.words)) {
    wordList = jsonData.words;
  } else if (jsonData.results?.channels?.[0]?.alternatives?.[0]?.words) {
    // Deepgram format
    wordList = jsonData.results.channels[0].alternatives[0].words;
  } else {
    throw new Error('Unsupported JSON transcript format. Expected an array of words with start and end times.');
  }

  if (wordList.length === 0) return [];

  // Group words into scene beats based on pauses or punctuation
  const scenes = [];
  let currentWords = [];
  let sceneIndex = 1;

  for (let i = 0; i < wordList.length; i++) {
    const rawWord = wordList[i];
    const wordText = rawWord.word || rawWord.text || '';
    const startSec = typeof rawWord.start === 'number' ? rawWord.start : parseFloat(rawWord.start || 0);
    const endSec = typeof rawWord.end === 'number' ? rawWord.end : parseFloat(rawWord.end || (startSec + 0.3));

    const wordObj = {
      word: wordText,
      startSec,
      endSec,
      startFrame: Math.round(startSec * fps),
      endFrame: Math.round(endSec * fps)
    };

    currentWords.push(wordObj);

    const isLastWord = i === wordList.length - 1;
    const nextWord = !isLastWord ? wordList[i + 1] : null;
    const nextStartSec = nextWord ? (typeof nextWord.start === 'number' ? nextWord.start : parseFloat(nextWord.start || 0)) : 0;
    
    const pauseToNext = nextWord ? nextStartSec - endSec : 0;
    const endsWithTerminalPunctuation = /[.!?]$/.test(wordText.trim());

    // Trigger scene split on long pause, sentence end with moderate pause, or max word limit
    if (isLastWord || pauseToNext > pauseThresholdSec || (endsWithTerminalPunctuation && pauseToNext > 0.3) || currentWords.length >= 18) {
      const sceneStartSec = currentWords[0].startSec;
      const sceneEndSec = currentWords[currentWords.length - 1].endSec;
      const startFrame = Math.round(sceneStartSec * fps);
      const endFrame = Math.round(sceneEndSec * fps);
      const transcript = currentWords.map(w => w.word).join(' ');

      const visualStyles = ['3d-retro-ps1', 'server-isometric', 'vox-collage', 'kinetic-text'];
      const chosenStyle = visualStyles[(sceneIndex - 1) % visualStyles.length];

      scenes.push({
        id: `scene-${sceneIndex}`,
        index: sceneIndex,
        startSec: sceneStartSec,
        endSec: sceneEndSec,
        startFrame,
        endFrame,
        durationFrames: Math.max(1, endFrame - startFrame),
        transcript,
        visualTheme: chosenStyle,
        componentFile: `Scene${sceneIndex}_Beat.jsx`,
        words: [...currentWords]
      });

      currentWords = [];
      sceneIndex++;
    }
  }

  return scenes;
}
