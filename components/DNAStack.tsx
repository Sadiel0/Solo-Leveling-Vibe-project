import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

interface DailyExercise {
  id: string;
  name: string;
  target: number;
  unit: string;
  icon: string;
  completed: boolean;
}

export const DNAStack: React.FC = () => {
  const { userStats, completeProtocol } = useAppContext();
  const [exercises, setExercises] = useState<DailyExercise[]>([
    { id: 'pushups', name: 'Push-ups', target: 100, unit: 'reps', icon: 'fitness', completed: false },
    { id: 'situps', name: 'Sit-ups', target: 100, unit: 'reps', icon: 'body', completed: false },
    { id: 'squats', name: 'Squats', target: 100, unit: 'reps', icon: 'walk', completed: false },
    { id: 'run', name: 'Run', target: 1, unit: 'mile', icon: 'speedometer', completed: false },
  ]);

  const completedCount = exercises.filter(ex => ex.completed).length;
  const allCompleted = completedCount === exercises.length;

  const toggleExercise = (exerciseId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const handleCompleteAll = async () => {
    if (!allCompleted) {
      Alert.alert('Not Complete', 'Complete all exercises to earn 100 XP!');
      return;
    }
    
    await completeProtocol('daily-non-negotiable', 100);
    Alert.alert('Daily Non-Negotiable Complete!', 'You earned 100 XP!');
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

      <TouchableOpacity
        style={[styles.completeButton, !allCompleted && styles.completeButtonDisabled]}
        onPress={handleCompleteAll}
        disabled={!allCompleted}
        activeOpacity={0.8}
      >
        <Ionicons name="trophy" size={20} color={Colors.dark.background} />
        <Text style={styles.completeButtonText}>COMPLETE DAILY (100 XP)</Text>
      </TouchableOpacity>
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
}); 