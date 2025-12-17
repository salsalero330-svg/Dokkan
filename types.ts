export type DokkanType = 'AGL' | 'TEQ' | 'INT' | 'STR' | 'PHY';
export type DokkanClass = 'Super' | 'Extreme';
export type Rarity = 'UR' | 'LR' | 'TUR' | 'EZA';

export interface Character {
  id: string;
  name: string;
  subtitle: string; // e.g. "Awakened Power"
  type: DokkanType;
  class: DokkanClass;
  rarity: Rarity;
  categories: string[];
  links: string[];
  leaderSkill: string;
  passiveSkill: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
  };
}

export interface TeamAnalysis {
  rating: number; // 1-10
  summary: string;
  strengths: string[];
  weaknesses: string[];
  rotations: string[]; // Suggested rotations
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
