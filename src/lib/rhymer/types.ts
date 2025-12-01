// Types for rhymer library

export type Language = 'cn' | 'en';
export type RhymeType = 1 | 2 | 3 | 4;

export interface RhymeResult {
  word: string;
}

export interface ChineseOptions {
  type: RhymeType;
  toneMatch: boolean;
}
