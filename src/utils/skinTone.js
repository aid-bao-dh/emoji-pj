/**
 * Unicode UTS #51 Compliant Skin Tone Modifier Utility
 */

export const SKIN_TONES = [
  { label: 'Mặc định (Vàng)', value: '', color: '#FFC83D' },
  { label: 'Sáng', value: '\u{1F3FB}', color: '#FADCBC' },
  { label: 'Sáng vừa', value: '\u{1F3FC}', color: '#E0BB95' },
  { label: 'Trung bình', value: '\u{1F3FD}', color: '#BF8F68' },
  { label: 'Ngăm đen', value: '\u{1F3FE}', color: '#9B643D' },
  { label: 'Tối màu', value: '\u{1F3FF}', color: '#594539' }
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
