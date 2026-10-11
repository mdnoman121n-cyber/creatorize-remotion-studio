/**
 * Formats seconds into MM:SS.mmm or HH:MM:SS.mmm
 */
export function formatTime(seconds, includeMs = true) {
  if (isNaN(seconds) || seconds < 0) return includeMs ? '00:00.00' : '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  const pad = (num, len = 2) => String(num).padStart(len, '0');
  
  if (includeMs) {
    return `${pad(mins)}:${pad(secs)}.${pad(ms)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Formats frames into MM:SS:FF based on FPS
 */
export function formatFrames(frame, fps = 30) {
  const totalSecs = frame / fps;
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.floor(totalSecs % 60);
  const remainingFrames = Math.floor(frame % fps);

  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(mins)}:${pad(secs)}:${pad(remainingFrames)}`;
}

/**
 * Converts timestamp string (00:01:23,456 or 00:01:23.456) to seconds
 */
export function parseTimestampToSeconds(timestamp) {
  const clean = timestamp.trim().replace(',', '.');
  const parts = clean.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const mins = parseFloat(parts[1]);
    const secs = parseFloat(parts[2]);
    return hours * 3600 + mins * 60 + secs;
  }
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    return mins * 60 + secs;
  }
  return parseFloat(clean) || 0;
}
