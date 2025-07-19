import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../types';

const STORAGE_KEYS = {
  USER_STATS: 'operator_training_user_stats',
  COMPLETED_PROTOCOLS: 'operator_training_completed_protocols',
};

export const getDefaultUserStats = (): UserStats => ({
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toDateString(),
  attributes: {
    mind: 0,
    body: 0,
    spirit: 0,
  },
  completedProtocols: [],
});

export const loadUserStats = async (): Promise<UserStats> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (stored) {
      return JSON.parse(stored);
    }
    return getDefaultUserStats();
  } catch (error) {
    console.error('Error loading user stats:', error);
    return getDefaultUserStats();
  }
};

export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }
};

export const loadCompletedProtocols = async (): Promise<string[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_PROTOCOLS);
    if (stored) {
      const data = JSON.parse(stored);
      // Check if the data is from today
      const today = new Date().toDateString();
      if (data.date === today) {
        return data.protocols;
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading completed protocols:', error);
    return [];
  }
};

export const saveCompletedProtocols = async (protocols: string[]): Promise<void> => {
  try {
    const data = {
      date: new Date().toDateString(),
      protocols,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_PROTOCOLS, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving completed protocols:', error);
  }
};

export const addCompletedProtocol = async (protocolId: string): Promise<void> => {
  try {
    const completed = await loadCompletedProtocols();
    if (!completed.includes(protocolId)) {
      completed.push(protocolId);
      await saveCompletedProtocols(completed);
    }
  } catch (error) {
    console.error('Error adding completed protocol:', error);
  }
};

export const clearCompletedProtocols = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.COMPLETED_PROTOCOLS);
  } catch (error) {
    console.error('Error clearing completed protocols:', error);
  }
}; 