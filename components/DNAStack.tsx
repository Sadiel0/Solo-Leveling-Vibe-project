import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

const COMPLETION_KEY = 'daily_nonnegotiable_completed_date';
const XP_REWARD = 100;

interface DailyExercise {
  id: string;
  name: string;
  target: number;
  unit: string;
  icon: string;
  completed: boolean;
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

export const DNAStack: React.FC = () => {
  const { completeProtocol } = useAppContext();
  const initialExercises: DailyExercise[] = [
    { id: 'pushups', name: 'Push-ups', target: 100, unit: 'reps', icon: 'fitness', completed: false },
    { id: 'situps', name: 'Sit-ups', target: 100, unit: 'reps', icon: 'body', completed: false },
    { id: 'squats', name: 'Squats', target: 100, unit: 'reps', icon: 'walk', completed: false },
    { id: 'run', name: 'Run', target: 1, unit: 'mile', icon: 'speedometer', completed: false },
  ];
  const [exercises, setExercises] = useState<DailyExercise[]>(initialExercises);
  const completedCount = exercises.filter(ex => ex.completed).length;
  const allCompleted = completedCount === exercises.length;
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Check completion state
    const checkCompleted = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const stored = await AsyncStorage.getItem(COMPLETION_KEY);
      if (stored === today) {
        setCompleted(true);
        setExercises(initialExercises.map(ex => ({ ...ex, completed: true })));
      } else {
        setCompleted(false);
        setExercises(initialExercises);
      }
    };
    checkCompleted();
  }, []);

  useEffect(() => {
    if (!completed) return;
    const updateCountdown = () => {
      setCountdown(getTimeToNextMidnight());
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [completed]);

  const toggleExercise = (exerciseId: string) => {
    if (completed) return; // Prevent toggling after completion
    setExercises(prev => prev.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const handleCompleteAll = async () => {
    if (!allCompleted || completed) {
      if (!completed) Alert.alert('Not Complete', 'Complete all exercises to earn 100 XP!');
      return;
    }
    setCompleting(true);
    await completeProtocol('daily-non-negotiable', XP_REWARD);
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(COMPLETION_KEY, today);
    setCompleted(true);
    setExercises(prev => prev.map(ex => ({ ...ex, completed: true })));
    setCompleting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DAILY NON-NEGOTIABLE</Text>
      <Text style={styles.subtitle}>Complete all to earn 100 XP</Text>
      <View style={styles.exercisesList}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[styles.exerciseRow, exercise.completed && styles.exerciseCompleted]}
            onPress={() => toggleExercise(exercise.id)}
            activeOpacity={0.7}
            disabled={completed}
          >
            <View style={styles.exerciseInfo}>
              <Ionicons
                name={exercise.icon as any}
                size={20}
                color={exercise.completed ? Colors.dark.success : Colors.dark.text}
                style={styles.icon}
              />
              <Text style={[styles.exerciseName, exercise.completed && styles.exerciseNameCompleted]}>
                {exercise.name}
              </Text>
              <Text style={[styles.exerciseTarget, exercise.completed && styles.exerciseNameCompleted]}>
                {exercise.target} {exercise.unit}
              </Text>
            </View>
            <View style={[styles.checkbox, exercise.completed && styles.checkboxCompleted]}>
              {exercise.completed && (
                <Ionicons name="checkmark" size={16} color={Colors.dark.background} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {completedCount}/{exercises.length} Complete
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / exercises.length) * 100}%` }
            ]}
          />
        </View>
      </View>
      {completed ? (
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle" size={32} color={Colors.dark.success} />
          <Text style={styles.completedText}>Completed</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="time" size={18} color={Colors.dark.primary} style={{ marginRight: 6 }} />
            <Text style={styles.completedSubtext}>Next available in {countdown}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.completeButton, (!allCompleted || completing) && { opacity: 0.7 }]}
          onPress={handleCompleteAll}
          disabled={!allCompleted || completed || completing}
          activeOpacity={0.8}
        >
          <Ionicons name="trophy" size={20} color={Colors.dark.background} />
          <Text style={styles.completeButtonText}>COMPLETE DAILY (100 XP)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  exercisesList: {
    marginBottom: 20,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.backgroundVariant,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  exerciseCompleted: {
    backgroundColor: Colors.dark.success + '20',
    borderColor: Colors.dark.success,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  exerciseName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  exerciseNameCompleted: {
    color: Colors.dark.success,
  },
  exerciseTarget: {
    color: Colors.dark.text,
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.dark.success,
    borderColor: Colors.dark.success,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.success,
    borderRadius: 3,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.success,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  completeButtonDisabled: {
    backgroundColor: Colors.dark.border,
  },
  completeButtonText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  completedText: {
    color: Colors.dark.success,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  completedSubtext: {
    color: Colors.dark.text,
    fontSize: 14,
    opacity: 0.7,
  },
}); 