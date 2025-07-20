import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { getDailyProtocols } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BodyScreen() {
  const { completedProtocols, completeProtocol } = useAppContext();
  const protocols = getDailyProtocols().body;
  const currentProtocol = protocols[0];
  const isCompleted = completedProtocols.includes(currentProtocol.id);

  // Countdown to next midnight
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    const getNextMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0); // Next midnight
      return next;
    };
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = getNextMidnight();
      const diff = nextMidnight.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteProtocol = async () => {
    if (isCompleted) return;
    await completeProtocol(currentProtocol.id, currentProtocol.xpReward);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.dark.success;
      case 'intermediate': return Colors.dark.warning;
      case 'hard': return Colors.dark.error;
      default: return Colors.dark.primary;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'flash-outline';
      case 'intermediate': return 'flash';
      case 'hard': return 'flash';
      default: return 'flash-outline';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* System Header */}
      <View style={styles.systemHeader}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={32} color={Colors.dark.success} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>PHYSICAL PROTOCOLS</Text>
            <Text style={styles.subtitle}>Strength and endurance training</Text>
          </View>
        </View>
      </View>

      {/* Current Protocol Display */}
      <View style={styles.protocolContainer}>
        {/* Protocol Header */}
        <View style={styles.protocolHeader}>
          <Text style={styles.protocolTitle}>{currentProtocol.name}</Text>
          <Text style={styles.protocolDescription}>{currentProtocol.description}</Text>
        </View>

        {/* Protocol Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="trophy" size={20} color={Colors.dark.success} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{currentProtocol.xpReward}</Text>
              <Text style={styles.statLabel}>XP REWARD</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{currentProtocol.duration}</Text>
              <Text style={styles.statLabel}>DURATION</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: getDifficultyColor(currentProtocol.difficulty) + '20' }]}>
              <Ionicons 
                name={getDifficultyIcon(currentProtocol.difficulty) as any} 
                size={20} 
                color={getDifficultyColor(currentProtocol.difficulty)} 
              />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: getDifficultyColor(currentProtocol.difficulty) }]}>
                {currentProtocol.difficulty.toUpperCase()}
              </Text>
              <Text style={styles.statLabel}>DIFFICULTY</Text>
            </View>
          </View>
        </View>

        {/* Workout Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>WORKOUT INSTRUCTIONS</Text>
          <View style={styles.instructionsBox}>
            {currentProtocol.details?.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {instruction}
              </Text>
            ))}
          </View>
        </View>

        {/* Completion Status */}
        {isCompleted && (
          <View style={styles.completedContainer}>
            <View style={styles.completedIcon}>
              <Ionicons name="checkmark-circle" size={32} color={Colors.dark.success} />
            </View>
            <Text style={styles.completedText}>PROTOCOL COMPLETED</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Ionicons name="time" size={20} color={Colors.dark.primary} style={{ marginRight: 6 }} />
              <Text style={styles.completedSubtext}>Next protocol in {countdown}</Text>
            </View>
          </View>
        )}

        {/* Complete Button */}
        {!isCompleted && (
          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleCompleteProtocol}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={24} color={Colors.dark.background} />
            <Text style={styles.completeButtonText}>MARK AS COMPLETE</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.success,
    shadowColor: Colors.dark.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  protocolContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  protocolHeader: {
    marginBottom: 24,
  },
  protocolTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  protocolDescription: {
    fontSize: 16,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.dark.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionsBox: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  instructionText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  completedIcon: {
    marginBottom: 16,
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.success,
    marginBottom: 8,
  },
  completedSubtext: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.success,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: Colors.dark.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.background,
    marginLeft: 8,
  },
}); 