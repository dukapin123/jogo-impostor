export interface WordItem {
  id: string;
  word: string;
  hint: string;
  category: string;
}

export interface WordCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  words: Omit<WordItem, 'category'>[];
}

export interface WordManagerStats {
  total: number;
  used: number;
  available: number;
  byCategory: Record<string, { total: number; used: number; available: number }>;
}
