// English rhymer logic
import pako from 'pako';

interface WordEntry {
  word: string;
  pron: string;
}

interface RhymeCandidate {
  score: number;
  pron: string;
  word: string;
}

let words: WordEntry[] | null = null;

/**
 * Count matching trailing syllables
 */
function countMatchingTrailingSyllables(a: string, b: string): number {
  const left = a.split(' ').reverse();
  const right = b.split(' ').reverse();
  const length = Math.max(left.length, right.length);
  let index = -1;
  let score = 0;

  while (++index < length) {
    if (left[index] !== right[index]) {
      return score;
    }
    score++;
  }

  // Do not return words with exactly the same pronunciation
  return 0;
}

function cleanAlternative(word: string): string {
  const pos = word.indexOf('(');
  return pos === -1 ? word : word.slice(0, pos);
}

function sort(a: RhymeCandidate, b: RhymeCandidate): number {
  return b.score - a.score || a.word.localeCompare(b.word);
}

/**
 * Load English dictionary
 */
const loadDictionary = async (): Promise<void> => {
  if (words) return;

  try {
    const response = await fetch('/data/en_rhyme_dict.bin');
    const buffer = await response.arrayBuffer();

    // Decompress
    const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
    words = JSON.parse(decompressed);

    console.log('English Dictionary loaded. Words:', words!.length);
  } catch (e) {
    console.error('Failed to load English dictionary:', e);
    words = [];
  }
};

/**
 * Get English rhymes
 */
export const getRhymes = async (value: string): Promise<string[]> => {
  await loadDictionary();

  const results: RhymeCandidate[] = [];

  if (!value || !words) return [];

  value = value.toLowerCase();

  // Find pronunciation of input word
  const inputEntry = words.find(w => w.word === value);

  if (!inputEntry) return [];

  const pron = inputEntry.pron;

  // Check all words
  words.forEach(other => {
    const score = countMatchingTrailingSyllables(pron, other.pron);

    if (score > 1) {
      results.push({
        score: score,
        pron: other.pron,
        word: cleanAlternative(other.word)
      });
    }
  });

  // Sort and return top 50
  return results.sort(sort).slice(0, 50).map(item => item.word);
};
