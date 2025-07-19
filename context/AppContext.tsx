import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRandomQuote } from '../data/mockData';
import { addCompletedProtocol, loadCompletedProtocols, loadUserStats, saveUserStats } from '../services/storage';
import { Quote, UserStats } from '../types';
import { addXP, updateStreak } from '../utils/gameLogic';

interface AppContextType {
  userStats: UserStats;
  completedProtocols: string[];
  dailyQuote: Quote;
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
  const [dailyQuote, setDailyQuote] = useState<Quote>(getRandomQuote());

  useEffect(() => {
    const initializeApp = async () => {
      const stats = await loadUserStats();
      const completed = await loadCompletedProtocols();
      
      // Update streak on app start
      const updatedStats = updateStreak(stats);
      setUserStats(updatedStats);
      setCompletedProtocols(completed);
      
      // Save updated stats
      await saveUserStats(updatedStats);
    };

    initializeApp();
  }, []);

  const updateUserStats = (stats: UserStats) => {
    setUserStats(stats);
    saveUserStats(stats);
  };

  const completeProtocol = async (protocolId: string, xpReward: number) => {
    if (!userStats) return;

    // Add XP and update stats
    const newStats = addXP(userStats, xpReward);
    updateUserStats(newStats);

    // Add to completed protocols
    await addCompletedProtocol(protocolId);
    const updatedCompleted = await loadCompletedProtocols();
    setCompletedProtocols(updatedCompleted);
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
        dailyQuote,
        updateUserStats,
        completeProtocol,
        refreshQuote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 