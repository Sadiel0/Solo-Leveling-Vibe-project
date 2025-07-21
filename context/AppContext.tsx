import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRandomQuote } from '../data/mockData';
import { addCompletedProtocol, addProtocolCompletion, loadCompletedProtocols, loadProtocolCompletions, loadUserStats, saveUserStats } from '../services/storage';
import { ProtocolCompletion, Quote, UserStats } from '../types';
import { addXP, updateStreak } from '../utils/gameLogic';

interface AppContextType {
  userStats: UserStats;
  completedProtocols: string[];
  protocolCompletions: ProtocolCompletion[];
  dailyQuote: Quote;
  userName: string | null;
  setUserName: (name: string) => Promise<void>;
  updateUserStats: (stats: UserStats) => void;
  completeProtocol: (protocolId: string, xpReward: number) => Promise<void>;
  refreshQuote: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [completedProtocols, setCompletedProtocols] = useState<string[]>([]);
  const [protocolCompletions, setProtocolCompletions] = useState<ProtocolCompletion[]>([]);
  const [dailyQuote, setDailyQuote] = useState<Quote>(getRandomQuote());
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      const stats = await loadUserStats();
      const completed = await loadCompletedProtocols();
      const completions = await loadProtocolCompletions();
      const storedName = await AsyncStorage.getItem('user_name');
      setUserNameState(storedName);
      // Update streak on app start
      const updatedStats = updateStreak(stats);
      setUserStats(updatedStats);
      setCompletedProtocols(completed);
      setProtocolCompletions(completions);
      // Save updated stats
      await saveUserStats(updatedStats);
    };
    initializeApp();
  }, []);

  const setUserName = async (name: string) => {
    setUserNameState(name);
    await AsyncStorage.setItem('user_name', name);
  };

  const updateUserStats = (stats: UserStats) => {
    setUserStats(stats);
    saveUserStats(stats);
  };

  const completeProtocol = async (protocolId: string, xpReward: number) => {
    if (!userStats) return;
    // Add XP and update stats
    const newStats = addXP(userStats, xpReward);
    updateUserStats(newStats);
    // Add to completed protocols (legacy, for today)
    await addCompletedProtocol(protocolId);
    const updatedCompleted = await loadCompletedProtocols();
    setCompletedProtocols(updatedCompleted);
    // Add protocol completion with timestamp
    await addProtocolCompletion(protocolId);
    const completions = await loadProtocolCompletions();
    setProtocolCompletions(completions);
  };

  const refreshQuote = () => {
    setDailyQuote(getRandomQuote());
  };

  if (!userStats) {
    // Loading state
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        userStats,
        completedProtocols,
        protocolCompletions,
        dailyQuote,
        userName,
        setUserName,
        updateUserStats,
        completeProtocol,
        refreshQuote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 