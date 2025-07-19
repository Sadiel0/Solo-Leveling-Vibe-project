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
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  category: 'mind' | 'body' | 'spirit';
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: string; // Optional duration estimate
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