export interface TrackerEntry {
  id: string; // Token ID
  name: string;
  isAuto: boolean;
  modifier: number;
  score: number;
  hp: number;
  maxHp: number;
  conditions: string[];
}

export interface SavedCharacter {
  id: string;
  name: string;
  modifier: number;
  maxHp: number;
}

export interface RoomData {
  entries: TrackerEntry[];
  activeIndex: number;
  round: number;
  inCombat: boolean;
}

export interface ConditionPreset {
  name: string;
  color: string;
}
