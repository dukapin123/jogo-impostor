import { WordItem } from './word';

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  word?: string;
  hint?: string;
  hasViewedRole?: boolean;
}

export interface GameSettings {
  impostorCount: 1 | 2;
  giveHintToImpostor: boolean;
  impostorsKnowEachOther: boolean;
  categoryId: string; // 'all' for Aleatório or specific category ID
}

export type GamePhase = 'setup' | 'reveal' | 'play' | 'voting' | 'result';
