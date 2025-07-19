import { ProtocolCard } from '@/components/ProtocolCard';
import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { getDailyProtocols } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BodyScreen() {
  const { completedProtocols, completeProtocol } = useAppContext();
  const protocols = getDailyProtocols().body;

  const handleCompleteProtocol = async (protocol: any) => {
    await completeProtocol(protocol.id, protocol.xpReward);
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

      {/* Progress Summary */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>TODAY'S PROGRESS</Text>
        <View style={styles.progressBox}>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {completedProtocols.filter(id => id.startsWith('body-')).length}
              </Text>
              <Text style={styles.progressLabel}>COMPLETED</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{protocols.length}</Text>
              <Text style={styles.progressLabel}>TOTAL</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {Math.round((completedProtocols.filter(id => id.startsWith('body-')).length / protocols.length) * 100)}%
              </Text>
              <Text style={styles.progressLabel}>PROGRESS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Protocols List */}
      <View style={styles.protocolsContainer}>
        <Text style={styles.sectionTitle}>AVAILABLE PROTOCOLS</Text>
        {protocols.map((protocol) => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            isCompleted={completedProtocols.includes(protocol.id)}
            onComplete={() => handleCompleteProtocol(protocol)}
          />
        ))}
      </View>

      {/* Empty State */}
      {protocols.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="fitness-outline" size={64} color={Colors.dark.border} />
          </View>
          <Text style={styles.emptyText}>NO PHYSICAL PROTOCOLS AVAILABLE</Text>
          <Text style={styles.emptySubtext}>Check back tomorrow for new challenges</Text>
        </View>
      )}
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
  progressContainer: {
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
  progressBox: {
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
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.success,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.dark.border,
  },
  protocolsContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 