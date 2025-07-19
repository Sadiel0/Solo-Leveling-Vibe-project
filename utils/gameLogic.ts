import { UserStats } from '../types';

// XP calculation formula: nextLevelXP = 100 * Math.pow(currentLevel, 1.5)
export const calculateNextLevelXP = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
};

export const calculateLevel = (totalXp: number): number => {
  let level = 1;
  let xpForNextLevel = calculateNextLevelXP(level);
  
  while (totalXp >= xpForNextLevel) {
    totalXp -= xpForNextLevel;
    level++;
    xpForNextLevel = calculateNextLevelXP(level);
  }
  
  return level;
};

export const calculateCurrentLevelXP = (totalXp: number): number => {
  let level = 1;
  let remainingXp = totalXp;
  let xpForNextLevel = calculateNextLevelXP(level);
  
  while (remainingXp >= xpForNextLevel) {
    remainingXp -= xpForNextLevel;
    level++;
    xpForNextLevel = calculateNextLevelXP(level);
  }
  
  return remainingXp;
};

export const addXP = (currentStats: UserStats, xpToAdd: number): UserStats => {
  const newTotalXp = currentStats.totalXp + xpToAdd;
  const newLevel = calculateLevel(newTotalXp);
  const newCurrentXP = calculateCurrentLevelXP(newTotalXp);
  
  return {
    ...currentStats,
    level: newLevel,
    xp: newCurrentXP,
    totalXp: newTotalXp,
  };
};

export const updateStreak = (currentStats: UserStats): UserStats => {
  const today = new Date().toDateString();
  const lastActive = new Date(currentStats.lastActiveDate).toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  let newStreak = currentStats.streak;
  let newLongestStreak = currentStats.longestStreak;
  
  if (today === lastActive) {
    // Already active today, no change
    return currentStats;
  } else if (lastActive === yesterday) {
    // Consecutive day
    newStreak = currentStats.streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }
  
  if (newStreak > newLongestStreak) {
    newLongestStreak = newStreak;
  }
  
  return {
    ...currentStats,
    streak: newStreak,
    longestStreak: newLongestStreak,
    lastActiveDate: today,
  };
};

export const getRankTitle = (level: number): string => {
  if (level >= 100) return "S-Rank Operator";
  if (level >= 80) return "A-Rank Operator";
  if (level >= 60) return "B-Rank Operator";
  if (level >= 40) return "C-Rank Operator";
  if (level >= 20) return "D-Rank Operator";
  if (level >= 10) return "E-Rank Operator";
  return "F-Rank Recruit";
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return '#10b981'; // Green
    case 'medium':
      return '#f59e0b'; // Amber
    case 'hard':
      return '#ef4444'; // Red
    default:
      return '#64748b'; // Gray
  }
}; 