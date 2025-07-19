import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { calculateNextLevelXP } from '../utils/gameLogic';

interface XPBarProps {
  currentXP: number;
  level: number;
  showText?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, level, showText = true }) => {
  const nextLevelXP = calculateNextLevelXP(level);
  const progress = currentXP / nextLevelXP;

  return (
    <View style={styles.container}>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.xpText}>XP: {currentXP} / {nextLevelXP}</Text>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
      )}
      <View style={styles.barContainer}>
        <View style={styles.backgroundBar}>
          <LinearGradient
            colors={[Colors.dark.xpBar, Colors.dark.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  levelText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    width: '100%',
  },
  backgroundBar: {
    height: 8,
    backgroundColor: Colors.dark.xpBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
}); 