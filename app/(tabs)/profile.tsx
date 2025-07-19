import { XPBar } from '@/components/XPBar';
import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { calculateNextLevelXP, getRankTitle } from '@/utils/gameLogic';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { userStats } = useAppContext();
  const nextLevelXP = calculateNextLevelXP(userStats.level);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* System Header */}
      <View style={styles.systemHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.dark.primary} />
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <View style={styles.rankOval}>
            <Text style={styles.rankText}>{getRankTitle(userStats.level)}</Text>
          </View>
          <Text style={styles.levelText}>LEVEL {userStats.level}</Text>
          <Text style={styles.operatorText}>OPERATOR ID: {userStats.totalXp.toString().padStart(6, '0')}</Text>
        </View>
      </View>

      {/* XP Progress */}
      <View style={styles.xpContainer}>
        <Text style={styles.sectionTitle}>EXPERIENCE PROGRESS</Text>
        <View style={styles.xpBox}>
          <XPBar currentXP={userStats.xp} level={userStats.level} showText={false} />
          <Text style={styles.xpDetails}>
            {userStats.xp} / {nextLevelXP} XP TO NEXT LEVEL
          </Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>TRAINING STATISTICS</Text>
        <View style={styles.statsBox}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color={Colors.dark.warning} />
              <Text style={styles.statValue}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>CURRENT STREAK</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color={Colors.dark.levelUp} />
              <Text style={styles.statValue}>{userStats.longestStreak}</Text>
              <Text style={styles.statLabel}>LONGEST STREAK</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color={Colors.dark.primary} />
              <Text style={styles.statValue}>{userStats.totalXp}</Text>
              <Text style={styles.statLabel}>TOTAL XP</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Colors.dark.secondary} />
              <Text style={styles.statValue}>
                {new Date(userStats.lastActiveDate).toLocaleDateString()}
              </Text>
              <Text style={styles.statLabel}>LAST ACTIVE</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Attribute Breakdown */}
      <View style={styles.attributesContainer}>
        <Text style={styles.sectionTitle}>ATTRIBUTE BREAKDOWN</Text>
        
        <View style={styles.attributeCard}>
          <View style={styles.attributeHeader}>
            <Ionicons name="bulb" size={20} color={Colors.dark.secondary} />
            <Text style={styles.attributeName}>MENTAL</Text>
            <Text style={styles.attributeValue}>{userStats.attributes.mind}</Text>
          </View>
          <View style={styles.attributeBar}>
            <View 
              style={[
                styles.attributeProgress, 
                { 
                  width: `${Math.min((userStats.attributes.mind / 100) * 100, 100)}%`,
                  backgroundColor: Colors.dark.secondary 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.attributeCard}>
          <View style={styles.attributeHeader}>
            <Ionicons name="fitness" size={20} color={Colors.dark.success} />
            <Text style={styles.attributeName}>PHYSICAL</Text>
            <Text style={styles.attributeValue}>{userStats.attributes.body}</Text>
          </View>
          <View style={styles.attributeBar}>
            <View 
              style={[
                styles.attributeProgress, 
                { 
                  width: `${Math.min((userStats.attributes.body / 100) * 100, 100)}%`,
                  backgroundColor: Colors.dark.success 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.attributeCard}>
          <View style={styles.attributeHeader}>
            <Ionicons name="heart" size={20} color={Colors.dark.error} />
            <Text style={styles.attributeName}>SPIRITUAL</Text>
            <Text style={styles.attributeValue}>{userStats.attributes.spirit}</Text>
          </View>
          <View style={styles.attributeBar}>
            <View 
              style={[
                styles.attributeProgress, 
                { 
                  width: `${Math.min((userStats.attributes.spirit / 100) * 100, 100)}%`,
                  backgroundColor: Colors.dark.error 
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Rank Progression */}
      <View style={styles.rankContainer}>
        <Text style={styles.sectionTitle}>RANK PROGRESSION</Text>
        <View style={styles.rankBox}>
          <View style={[styles.rankItem, userStats.level >= 1 && styles.rankAchieved]}>
            <Text style={styles.rankName}>F-RANK RECRUIT</Text>
            <Text style={styles.rankLevel}>LEVEL 1+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 10 && styles.rankAchieved]}>
            <Text style={styles.rankName}>E-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 10+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 20 && styles.rankAchieved]}>
            <Text style={styles.rankName}>D-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 20+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 40 && styles.rankAchieved]}>
            <Text style={styles.rankName}>C-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 40+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 60 && styles.rankAchieved]}>
            <Text style={styles.rankName}>B-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 60+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 80 && styles.rankAchieved]}>
            <Text style={styles.rankName}>A-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 80+</Text>
          </View>
          <View style={[styles.rankItem, userStats.level >= 100 && styles.rankAchieved]}>
            <Text style={styles.rankName}>S-RANK OPERATOR</Text>
            <Text style={styles.rankLevel}>LEVEL 100+</Text>
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
    padding: 20,
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
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
    marginBottom: 8,
  },
  rankText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  operatorText: {
    fontSize: 12,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  xpContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  xpBox: {
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
  xpDetails: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  statsBox: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.text,
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'center',
  },
  attributesContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  attributeCard: {
    backgroundColor: Colors.dark.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  attributeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  attributeBar: {
    height: 6,
    backgroundColor: Colors.dark.xpBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  attributeProgress: {
    height: '100%',
    borderRadius: 3,
  },
  rankContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  rankBox: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  rankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  rankAchieved: {
    backgroundColor: Colors.dark.primary,
  },
  rankName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  rankLevel: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 