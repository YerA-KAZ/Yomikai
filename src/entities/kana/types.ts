export interface KanaChar {
  id: string;
  char: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string; // e.g., 'a', 'ka', 'sa'
  strokeOrder?: string[]; // SVG paths for stroke order
  examples: { word: string; reading: string; meaning: string }[];
  learned: boolean;
}

export interface KanaGroup {
  id: string;
  name: string;
  nameJp: string;
  chars: KanaChar[];
}
