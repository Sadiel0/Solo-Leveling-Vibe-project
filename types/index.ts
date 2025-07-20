export interface ProtocolCompletion {
  protocolId: string;
  completedAt: string; // ISO string
}

export interface UserStats {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  attributes: {
    mind: number;
    body: number;
    spirit: number;
  };
  completedProtocols: string[]; // Array of protocol IDs completed today
  protocolCompletions?: ProtocolCompletion[]; // Array of protocol completions with timestamps
  dailyXp: {
    body: number;
    mind: number;
    spirit: number;
    business: number;
  };
  totalXpByDomain: {
    body: number;
    mind: number;
    spirit: number;
  };
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  category: 'mind' | 'body' | 'spirit';
  difficulty: 'easy' | 'medium' | 'hard' | 'intermediate';
  duration?: string; // Optional duration estimate
  details?: string[];
  type?: string;
  tags?: string[];
}

export interface Quote {
  text: string;
  author: string;
  category: 'stoic' | 'philosophical' | 'motivational';
}

export interface DailyProtocols {
  mind: Protocol[];
  body: Protocol[];
  spirit: Protocol[];
}

export type TabType = 'mind' | 'body' | 'spirit' | 'profile'; 