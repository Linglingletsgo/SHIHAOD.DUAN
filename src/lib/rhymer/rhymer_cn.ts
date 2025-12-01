// Chinese rhymer logic
import { pinyin } from 'pinyin-pro';
import pako from 'pako';
import type { RhymeType } from './types';

let dictionary: { words: string[]; index: Record<string, number[]> } | null = null;
let wordList: string[] | null = null;
let indexMap: Record<string, number[]> | null = null;

/**
 * Get normalized finals for fuzzy rhyming based on phonetic similarity
 */
const getFinals = (word: string): string[] => {
  const fullPinyin = pinyin(word, { toneType: 'none', type: 'array' });
  const finals = pinyin(word, { pattern: 'final', type: 'array', toneType: 'none' });

  return finals.map((f, idx) => {
    const initial = fullPinyin[idx].replace(f, '');

    // Rule 1: Basic mappings
    if (f === 'iu') f = 'iou';
    if (f === 'ui') f = 'uei';
    if (f === 'un') f = 'uen';

    // Rule 2 & 3: Handle ü
    if (f === 'u' && ['j', 'q', 'x'].includes(initial)) {
      f = 'ü';
    }
    if (f === 'v') f = 'ü';
    if (f === 'üe') f = 'ü';
    if (f === 'üan') f = 'üan';
    if (f === 'ün') f = 'ün';

    // Rule 3: ü rhymes with i (except after buzzing initials)
    const buzzingInitials = ['z', 'c', 's', 'zh', 'ch', 'sh', 'r'];
    if (f === 'ü' && !buzzingInitials.includes(initial)) {
      f = 'i';
    }

    // Special buzzing i
    if (f === 'i' && buzzingInitials.includes(initial)) {
      f = 'i_buzz';
    }

    // Rule 4: in/en/un equivalence
    if (f === 'in' || f === 'en' || f === 'uen') {
      f = 'in_en_un';
    }

    // Rule 5: eng/ing equivalence
    if (f === 'eng' || f === 'ing') {
      f = 'eng_ing';
    }

    return f;
  });
};

const getTones = (word: string): string[] => {
  return pinyin(word, { pattern: 'num', type: 'array' });
};

/**
 * Load dictionary from public folder
 */
const loadDictionary = async (): Promise<void> => {
  if (dictionary) return;

  try {
    const response = await fetch('/data/phrase_dict.bin');
    const buffer = await response.arrayBuffer();
    
    // Decompress
    const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
    dictionary = JSON.parse(decompressed);
    wordList = dictionary!.words;
    indexMap = dictionary!.index;

    console.log('Dictionary loaded. Words:', wordList.length);
  } catch (e) {
    console.error('Failed to load dictionary:', e);
    wordList = [];
    indexMap = {};
  }
};

/**
 * Get rhymes for a given Chinese word
 */
export const getRhymes = async (
  word: string,
  type: RhymeType = 2,
  toneMatch: boolean = false
): Promise<string[]> => {
  if (!word) return [];

  await loadDictionary();

  if (!wordList || !indexMap) return [];

  const inputFinals = getFinals(word);
  const inputTones = getTones(word);

  if (word.length < type) {
    return [];
  }

  // Special handling for Single Rhyme (Type 1)
  if (type === 1) {
    const targetFinal = inputFinals[inputFinals.length - 1];
    const results: string[] = [];

    wordList.forEach(dictWord => {
      if (dictWord === word) return;

      const wordFinals = getFinals(dictWord);
      if (wordFinals.length === 0) return;

      const wordFinal = wordFinals[wordFinals.length - 1];

      if (wordFinal === targetFinal) {
        if (toneMatch) {
          const wordTones = getTones(dictWord);
          const targetTone = inputTones[inputTones.length - 1];
          if (wordTones[wordTones.length - 1] !== targetTone) return;
        }
        results.push(dictWord);
      }
    });
    return results;
  }

  // Get target rhyme key
  const targetFinals = inputFinals.slice(-type);
  const targetKey = targetFinals.join(' ');

  // Look up in index
  const candidateIndices = indexMap[targetKey];

  if (!candidateIndices) return [];

  const results: string[] = [];

  candidateIndices.forEach(index => {
    const dictWord = wordList![index];

    if (dictWord === word) return;

    if (toneMatch) {
      const wordTones = getTones(dictWord);
      const sliceTones = wordTones.slice(-type);
      const targetSliceTones = inputTones.slice(-type);

      const tonesMatch = sliceTones.every((tone, idx) => tone === targetSliceTones[idx]);
      if (!tonesMatch) return;
    }

    results.push(dictWord);
  });

  return results;
};
