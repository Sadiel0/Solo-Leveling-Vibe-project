import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { Protocol } from '../types';
import { getDifficultyColor } from '../utils/gameLogic';
import { Collapsible } from './Collapsible';

interface ProtocolCardProps {
  protocol: Protocol;
  isCompleted: boolean;
  onComplete: () => void;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({
  protocol,
  isCompleted,
  onComplete,
}) => {
  const hasDetails = protocol.details && protocol.details.length > 0;

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{protocol.name.toUpperCase()}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(protocol.difficulty) }]}>
            <Text style={styles.difficultyText}>{protocol.difficulty.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>+{protocol.xpReward} XP</Text>
        </View>
      </View>
      <Text style={styles.description}>{protocol.description}</Text>
      {protocol.duration && (
        <View style={styles.durationContainer}>
          <Ionicons name="time-outline" size={16} color={Colors.dark.text} />
          <Text style={styles.durationText}>{protocol.duration}</Text>
        </View>
      )}
      {hasDetails && (
        <Collapsible title="View Details">
          <View style={styles.detailsBox}>
            {protocol.details?.map((line, idx) => (
              <Text key={idx} style={styles.detailLine}>{line}</Text>
            ))}
            {protocol.tags && protocol.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {protocol.tags.map((tag) => (
                  <Text key={tag} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
          </View>
        </Collapsible>
      )}
      <TouchableOpacity
        style={[styles.completeButton, isCompleted && styles.completedButton]}
        onPress={onComplete}
        disabled={isCompleted}
      >
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
          size={24}
          color={isCompleted ? Colors.dark.success : Colors.dark.primary}
        />
        <Text style={[styles.completeText, isCompleted && styles.completedText]}>
          {isCompleted ? 'COMPLETED' : 'MARK COMPLETE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    borderColor: Colors.dark.success,
    shadowColor: Colors.dark.success,
    shadowOpacity: 0.3,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  xpContainer: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  xpText: {
    color: Colors.dark.backgroundVariant,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  durationText: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  completedButton: {
    borderColor: Colors.dark.success,
  },
  completeText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  completedText: {
    color: Colors.dark.success,
  },
  detailsBox: {
    backgroundColor: Colors.dark.backgroundVariant,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  detailLine: {
    color: Colors.dark.text,
    fontSize: 13,
    marginBottom: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.dark.primary,
    color: Colors.dark.backgroundVariant,
    fontSize: 11,
    fontWeight: 'bold',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
}); 