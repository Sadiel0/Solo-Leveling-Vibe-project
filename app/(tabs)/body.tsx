import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { getTodayWorkout, Workout } from '@/utils/workoutGenerator';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COMPLETION_KEY = 'ai_daily_workout_completed_date';

function getXPForDifficulty(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 50;
    case 'medium': return 75;
    case 'hard': return 100;
    default: return 50;
  }
}

function getTimeToNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:` +
    `${minutes.toString().padStart(2, '0')}:` +
    `${seconds.toString().padStart(2, '0')}`;
}

export default function BodyScreen() {
  const { completeProtocol, userStats } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    setLoading(true);
    getTodayWorkout().then(({ workout, error }) => {
      setWorkout(workout || null);
      setError(error || null);
      setLoading(false);
    });
    // Check completion state
    const checkCompleted = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const stored = await AsyncStorage.getItem(COMPLETION_KEY);
      setCompleted(stored === today);
    };
    checkCompleted();
  }, []);

  // Countdown timer for next protocol
  useEffect(() => {
    if (!completed) return;
    const updateCountdown = () => {
      setCountdown(getTimeToNextMidnight());
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [completed]);

  const handleComplete = async () => {
    if (!workout || completed) return;
    setCompleting(true);
    const xp = getXPForDifficulty(workout.difficulty);
    await completeProtocol('ai-daily-workout', xp);
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(COMPLETION_KEY, today);
    setCompleted(true);
    setCompleting(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
        <Text style={styles.loadingText}>Loading your daily workout...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={40} color={Colors.dark.error} />
        <Text style={styles.errorText}>Failed to load workout</Text>
        {error && <Text style={styles.errorSubtext}>{error}</Text>}
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          setLoading(true);
          setError(null);
          getTodayWorkout().then(({ workout, error }) => {
            setWorkout(workout || null);
            setError(error || null);
            setLoading(false);
          });
        }}>
          <Ionicons name="refresh" size={20} color={Colors.dark.background} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.description}>{workout.description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {workout.exercises.map((ex, idx) => (
          <View key={idx} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseReps}>{ex.reps}</Text>
            {ex.notes && <Text style={styles.exerciseNotes}>{ex.notes}</Text>}
          </View>
        ))}
      </View>
      <View style={styles.badgesRow}>
        <View style={styles.badgeXP}>
          <Ionicons name="trophy" size={18} color={Colors.dark.background} />
          <Text style={styles.badgeXPText}>{getXPForDifficulty(workout.difficulty)} XP</Text>
        </View>
        <View style={styles.badgeDifficulty}>
          <Ionicons name="flash" size={18} color={Colors.dark.background} />
          <Text style={styles.badgeDifficultyText}>{workout.difficulty}</Text>
        </View>
      </View>
      {/* Mark as Complete Button or Completed State */}
      {completed ? (
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle" size={36} color={Colors.dark.success} />
          <Text style={styles.completedText}>Workout Completed</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="time" size={20} color={Colors.dark.primary} style={{ marginRight: 6 }} />
            <Text style={styles.completedSubtext}>Next protocol in {countdown}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.completeButton, completing && { opacity: 0.7 }]}
          onPress={handleComplete}
          disabled={completing}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color={Colors.dark.background} />
          <Text style={styles.completeButtonText}>MARK AS COMPLETE</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundVariant,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.backgroundVariant,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: Colors.dark.text,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
  },
  retryButtonText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  exerciseName: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  exerciseReps: {
    color: Colors.dark.secondary,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  exerciseNotes: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 13,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  badgeXP: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.success,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  badgeXPText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  badgeDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.warning,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  badgeDifficultyText: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
    textTransform: 'uppercase',
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  completedText: {
    color: Colors.dark.success,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
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
    marginTop: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.background,
    marginLeft: 8,
  },
}); 