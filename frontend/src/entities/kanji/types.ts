export interface KanjiChar {
  id: string;
  char: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokeCount: number;
  examples: { word: string; reading: string; meaning: string }[];
  radical: string;
  learned: boolean;
  hint?: string;
  strokes?: { paths: string[]; order: number }[];
  words?: { word: string; reading: string; meaning: string }[];
}
