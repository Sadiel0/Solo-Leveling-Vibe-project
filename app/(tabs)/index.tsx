import { DNAStack } from '@/components/DNAStack';
import { XPBar } from '@/components/XPBar';
import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { quotes } from '@/data/mockData';
import { UserStats } from '@/types';
import { calculateNextLevelXP, getRankTitle } from '@/utils/gameLogic';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const DOMAIN_CONFIG = [
  { key: 'body', label: 'Body', color: Colors.dark.success, emoji: '💪' },
  { key: 'mind', label: 'Mind', color: Colors.dark.secondary, emoji: '🧠' },
  { key: 'spirit', label: 'Spirit', color: Colors.dark.error, emoji: '❤️' },
  { key: 'business', label: 'Business', color: '#FFD700', emoji: '📈' }, // gold
] as const;
type DomainKey = typeof DOMAIN_CONFIG[number]['key'];

function DomainCard({ domain, xp, percent, color, emoji }: { domain: string; xp: number; percent: number; color: string; emoji: string }) {
  return (
    <View style={styles.domainCard}>
      <View style={styles.domainCardHeader}>
        <Text style={[styles.domainCardEmoji, { color }]}>{emoji}</Text>
        <Text style={styles.domainCardLabel}>{domain}</Text>
        <Text style={styles.domainCardXp}>+{xp} XP</Text>
      </View>
      <View style={styles.domainCardBarBg}>
        <View style={[styles.domainCardBar, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.domainCardPercent}>{percent}% of today</Text>
    </View>
  );
}

function getDailyQuote() {
  // Use the current date as a seed to pick a quote for the day
  const today = new Date().toDateString();
  const hash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return quotes[hash % quotes.length];
}

export default function HomeScreen() {
  const { userStats } = useAppContext();
  const dailyQuote = getDailyQuote();
  const dailyXp: UserStats['dailyXp'] = userStats.dailyXp || { body: 0, mind: 0, spirit: 0, business: 0 };
  const totalDailyXp = DOMAIN_CONFIG.reduce((a, d) => a + (dailyXp[d.key] || 0), 0) || 1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* System Header */}
      <View style={styles.systemHeader}>
        <View style={styles.rankContainer}>
          <View style={styles.rankOval}>
            <Text style={styles.rankText}>{getRankTitle(userStats.level)}</Text>
          </View>
        </View>
        
        <View style={styles.levelContainer}>
          <Text style={styles.levelLabel}>CURRENT LEVEL</Text>
          <Text style={styles.levelNumber}>{userStats.level}</Text>
          {/* XP Progress Bar */}
          <View style={{ marginTop: 12, width: 180 }}>
            <XPBar currentXP={userStats.xp} level={userStats.level} showText={true} />
          </View>
          <View style={styles.levelDivider} />
        </View>
        
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>
            {userStats.xp} / {calculateNextLevelXP(userStats.level)} EXPERIENCE
          </Text>
        </View>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteSection}>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
        </View>
      </View>

      {/* Streak Section */}
      <View style={styles.streakSection}>
        <Text style={styles.streakLabel}>CURRENT STREAK</Text>
        <Text style={styles.streakValue}>{userStats.streak} DAYS</Text>
      </View>

      {/* DNA Stack Section */}
      <DNAStack />

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={styles.statValue}>{userStats.totalXp}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BEST STREAK</Text>
            <Text style={styles.statValue}>{userStats.longestStreak}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundVariant,
    paddingTop: 20,
  },
  systemHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  rankContainer: {
    marginBottom: 20,
  },
  rankOval: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  rankText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  levelLabel: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  levelNumber: {
    color: Colors.dark.text,
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: Colors.dark.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  levelDivider: {
    width: 100,
    height: 1,
    backgroundColor: Colors.dark.border,
    marginTop: 10,
  },
  xpContainer: {
    alignItems: 'center',
  },
  xpText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  quoteSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quoteBox: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 20,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  quoteAuthor: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  streakSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  streakLabel: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  streakValue: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  domainsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  domainsCardGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  domainCard: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 16,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  domainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  domainCardEmoji: {
    fontSize: 22,
    marginRight: 6,
  },
  domainCardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    flex: 1,
  },
  domainCardXp: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '600',
  },
  domainCardBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.dark.xpBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  domainCardBar: {
    height: '100%',
    borderRadius: 4,
  },
  domainCardPercent: {
    fontSize: 12,
    color: Colors.dark.text,
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'right',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statLabel: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginBottom: 40,
  },
  refreshText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
