/**
 * Unicode UTS #51 Compliant Skin Tone Modifier Utility
 */

export const SKIN_TONES = [
  { label: 'Mặc định', value: '', symbol: '🟡' },
  { label: 'Sáng', value: '\u{1F3FB}', symbol: '🏻' },
  { label: 'Sáng vừa', value: '\u{1F3FC}', symbol: '🏼' },
  { label: 'Trung bình', value: '\u{1F3FD}', symbol: '🏽' },
  { label: 'Ngăm đen', value: '\u{1F3FE}', symbol: '🏾' },
  { label: 'Tối màu', value: '\u{1F3FF}', symbol: '🏿' }
];

export function applySkinTone(emojiChar, skinTone, emojiMap) {
  if (!skinTone) return emojiChar;
  
  if (emojiMap) {
    const item = emojiMap.get(emojiChar);
    if (item && !item.skinTone) return emojiChar;
  }

  // Clean any previous skin tone modifier
  const clean = emojiChar.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '');

  // For ZWJ (Zero Width Joiner) sequences: insert skin tone after the human base and BEFORE \u200D
  if (clean.includes('\u200D')) {
    const parts = clean.split('\u200D');
    const newParts = parts.map((part, idx) => {
      if (idx === 0 || part === '🧑' || part === '👨' || part === '👩') {
        return part.replace(/\uFE0F/g, '') + skinTone;
      }
      return part;
    });
    return newParts.join('\u200D');
  }

  // For simple single-person or hand emojis: remove \uFE0F before appending skin tone
  return clean.replace(/\uFE0F/g, '') + skinTone;
}
