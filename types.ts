export interface LibraryItem {
  name: string;
  desc?: string;
  resource?: string;
  years?: string; // For investors
}

export interface ProtocolItem {
  id: string;
  label: string;
  xp?: number;
}

export interface ProtocolCard {
  id: string;
  title: string;
  maxXP: number;
  scoringType?: 'count_multiplier' | 'sum';
  perItemXP?: number;
  items: ProtocolItem[];
  details?: string[];
}

export interface ProtocolSection {
  title: string;
  columns: number;
  cards: ProtocolCard[];
}

export interface Workout {
  t: string; // Title/Day
  d: string; // Description
}

export interface PersonaConfig {
  anima: string;
  archetype: string;
  symbol: string;
}

export interface AppConfig {
  levels: { elite: number; strong: number; survival: number };
  maxXP: number;
  persona: PersonaConfig;
  library: {
    mentalModels: LibraryItem[];
    productivity: LibraryItem[];
    investors: LibraryItem[];
    quotes: string[];
  };
  workouts: Workout[];
  protocols: ProtocolSection[];
}

export interface DayData {
  date: string;
  checkedItems: Record<string, boolean>;
  note: string;
}

export interface AppState {
  config: AppConfig;
  history: Record<string, DayData>;
  currentDate: string;
}

export type TabType = 'mentalModels' | 'productivity' | 'investors' | 'quotes' | 'protocols' | 'workouts';