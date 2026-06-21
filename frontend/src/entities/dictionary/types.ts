export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: { japanese: string; russian: string }[];
  tags: string[];
}
