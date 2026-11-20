import { allEmojis, facebookSpecialCategories, groupNameMap } from '../src/data/emojis.js';
import { buildSearchIndex, searchEmojis, removeVietnameseAccents } from '../src/utils/search.js';
import { applySkinTone, SKIN_TONES } from '../src/utils/skinTone.js';

console.log('=== RUNNING COMPREHENSIVE EMOJI AUDIT ===');

let errors = 0;
let passed = 0;

function assert(condition, testName) {
  if (condition) {
    passed++;
  } else {
    errors++;
    console.error(`❌ FAILED: ${testName}`);
  }
}

// 1. Audit Dataset Completeness
assert(allEmojis.length >= 1900, `Dataset size check: ${allEmojis.length} emojis`);
assert(Object.keys(facebookSpecialCategories).length >= 7, 'Facebook curated categories exist');
assert(Object.keys(groupNameMap).length >= 9, 'All Unicode groups mapped to Vietnamese');

// 2. Audit EmojiMap indexing
const emojiMap = new Map();
allEmojis.forEach(e => emojiMap.set(e.emoji, e));
assert(emojiMap.size === allEmojis.length, 'All emojis have unique map entries');

// 3. Audit Skin Tone (UTS #51)
const popularSet = new Set();
Object.values(facebookSpecialCategories).forEach(cat => {
  cat.emojis.forEach(e => popularSet.add(e));
});

const skinTestCases = [
  { base: '👍', tone: '\u{1F3FD}', expected: '👍🏽', name: 'Simple hand modifier' },
  { base: '👨‍🍳', tone: '\u{1F3FD}', expected: '👨🏽‍🍳', name: 'Cook ZWJ sequence' },
  { base: '👩‍🏫', tone: '\u{1F3FB}', expected: '👩🏻‍🏫', name: 'Teacher ZWJ sequence' },
  { base: '🏃‍♀️', tone: '\u{1F3FE}', expected: '🏃🏾‍♀️', name: 'Woman runner ZWJ sequence' },
  { base: '☝️', tone: '\u{1F3FC}', expected: '☝🏼', name: 'VS16 hand modifier' },
  { base: '✍️', tone: '\u{1F3FD}', expected: '✍🏽', name: 'Writing hand VS16 modifier' },
  { base: '❤️', tone: '\u{1F3FD}', expected: '❤️', name: 'Non-skin emoji remains unchanged' },
  { base: '🔥', tone: '\u{1F3FD}', expected: '🔥', name: 'Fire remains unchanged' }
];

skinTestCases.forEach(tc => {
  const result = applySkinTone(tc.base, tc.tone, emojiMap);
  assert(result === tc.expected, `Skin tone test [${tc.name}]: expected ${tc.expected}, got ${result}`);
});

// 4. Audit Vietnamese Search Functionality
const searchIndex = buildSearchIndex(allEmojis, popularSet);

const searchTestCases = [
  { q: 'lua', topExpected: '🔥', name: 'Unaccented "lua"' },
  { q: 'lửa', topExpected: '🔥', name: 'Accented "lửa"' },
  { q: 'tich', topExpected: '✅', name: 'Unaccented "tich"' },
  { q: 'tích', topExpected: '✅', name: 'Accented "tích"' },
  { q: 'sao', topExpected: '⭐', name: 'Unaccented "sao"' },
  { q: 'tim', topExpected: '❤️', name: 'Unaccented "tim"' },
  { q: 'chi tay', topExpected: '👉', name: 'Unaccented "chi tay"' },
  { q: 'chuong', topExpected: '🔔', name: 'Unaccented "chuong"' },
  { q: 'tien', topExpected: '💰', name: 'Unaccented "tien"' },
  { q: 'dien thoai', topExpected: '📞', name: 'Unaccented "dien thoai"' },
  { q: 'xe', topExpected: '🛵', name: 'Unaccented "xe"' },
  { q: 'qua', topExpected: '🎁', name: 'Unaccented "qua"' },
  { q: 'ghim', topExpected: '📌', name: 'Unaccented "ghim"' },
  { q: 'muc tieu', topExpected: '🎯', name: 'Unaccented "muc tieu"' },
  { q: 'star', topExpected: '⭐', name: 'English "star"' },
  { q: 'check', topExpected: '✅', name: 'English "check"' },
  { q: 'fire', topExpected: '🔥', name: 'English "fire"' }
];

searchTestCases.forEach(tc => {
  const results = searchEmojis(tc.q, searchIndex, 5);
  const top = results[0]?.emoji;
  assert(top === tc.topExpected, `Search [${tc.name}]: expected top ${tc.topExpected}, got ${top}`);
});

// 5. Audit Search Edge Cases
assert(searchEmojis('', searchIndex).length === 0, 'Empty search returns empty array');
assert(searchEmojis('   ', searchIndex).length === 0, 'Whitespace search returns empty array');
assert(searchEmojis('nonexistentqueryxyz12345', searchIndex).length === 0, 'Nonsense query returns empty array');

// 6. Audit Skin Tones Colors Palette
assert(SKIN_TONES.length === 6, 'Exactly 6 skin tone options');
SKIN_TONES.forEach(tone => {
  assert(tone.color && tone.color.startsWith('#'), `Skin tone ${tone.label} has valid hex color: ${tone.color}`);
});

console.log('=== AUDIT SUMMARY ===');
console.log(`Passed: ${passed}/${passed + errors}`);
console.log(`Errors: ${errors}`);

if (errors === 0) {
  console.log('🎉 ALL AUDIT CHECKS PASSED WITH 0 ERRORS!');
  process.exit(0);
} else {
  console.error(`💥 ${errors} AUDIT CHECKS FAILED!`);
  process.exit(1);
}
