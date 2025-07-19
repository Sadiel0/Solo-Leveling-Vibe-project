import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { calculateNextLevelXP, getRankTitle } from '@/utils/gameLogic';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { userStats, dailyQuote, refreshQuote } = useAppContext();

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

      {/* Attribute Points Section */}
      <View style={styles.attributesSection}>
        <Text style={styles.attributesTitle}>ATTRIBUTE POINTS</Text>
        <View style={styles.attributesGrid}>
          <View style={styles.attributeItem}>
            <Text style={styles.attributeName}>PHYSICAL</Text>
            <View style={styles.attributeIcon}>
              <Ionicons name="fitness" size={20} color={Colors.dark.primary} />
            </View>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={styles.attributeName}>MENTAL</Text>
            <View style={styles.attributeIcon}>
              <Ionicons name="bulb" size={20} color={Colors.dark.primary} />
            </View>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={styles.attributeName}>SPIRITUAL</Text>
            <View style={styles.attributeIcon}>
              <Ionicons name="heart" size={20} color={Colors.dark.primary} />
            </View>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={styles.attributeName}>BUSINESS</Text>
            <View style={styles.attributeIcon}>
              <Ionicons name="briefcase" size={20} color={Colors.dark.primary} />
            </View>
          </View>
        </View>
      </View>

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

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={refreshQuote}>
        <Ionicons name="refresh" size={20} color={Colors.dark.primary} />
        <Text style={styles.refreshText}>REFRESH QUOTE</Text>
      </TouchableOpacity>
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
  attributesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  attributesTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  attributesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attributeItem: {
    alignItems: 'center',
    flex: 1,
  },
  attributeName: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  attributeIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
