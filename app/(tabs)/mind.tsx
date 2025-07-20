import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MENTAL_PROTOCOLS = [
  {
    id: 'mind-silence',
    name: 'Moment of Silence / Meditation',
    description: '10 minutes of silence or meditation to clear your mind.',
    icon: 'medal-outline',
    duration: '10 min',
  },
  {
    id: 'mind-reading',
    name: 'Read 10 Pages',
    description: 'Read at least 10 pages from a book of your choice.',
    icon: 'book-outline',
    duration: '10+ pages',
  },
  {
    id: 'mind-skill',
    name: 'Learn a Skill',
    description: 'Spend 30 minutes learning a new skill.',
    icon: 'bulb-outline',
    duration: '30 min',
  },
];

export default function MindScreen() {
  const { completedProtocols, completeProtocol } = useAppContext();
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    'mind-silence': completedProtocols.includes('mind-silence'),
    'mind-reading': completedProtocols.includes('mind-reading'),
    'mind-skill': completedProtocols.includes('mind-skill'),
  });

  const handleComplete = async (id: string) => {
    if (completed[id]) return;
    await completeProtocol(id, 33); // 33 XP each, total 99 XP
    setCompleted(prev => ({ ...prev, [id]: true }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Daily Video */}
      <View style={styles.videoSection}>
        <Text style={styles.videoLabel}>DAILY VIDEO</Text>
        <TouchableOpacity
          style={styles.videoBox}
          onPress={() => Linking.openURL('https://youtu.be/5vMFvPyfoII?si=j-wvO0Ckda0YuB5y')}
          activeOpacity={0.8}
        >
          <View style={styles.videoThumbnail}>
            <Ionicons name="play-circle" size={48} color={Colors.dark.background} />
            <Text style={styles.videoTitle}>Daily Learning Video</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videoLink}
          onPress={() => Linking.openURL('https://youtu.be/5vMFvPyfoII?si=j-wvO0Ckda0YuB5y')}
        >
          <Ionicons name="logo-youtube" size={18} color={Colors.dark.error} />
          <Text style={styles.videoLinkText}>Watch on YouTube</Text>
        </TouchableOpacity>
      </View>

      {/* Mental Protocols */}
      <View style={styles.protocolsContainer}>
        <Text style={styles.sectionTitle}>DAILY MENTAL PROTOCOL</Text>
        {MENTAL_PROTOCOLS.map((protocol) => (
          <TouchableOpacity
            key={protocol.id}
            style={[styles.protocolCard, completed[protocol.id] && styles.protocolCardCompleted]}
            onPress={() => handleComplete(protocol.id)}
            activeOpacity={0.8}
            disabled={completed[protocol.id]}
          >
            <View style={styles.protocolIconBox}>
              <Ionicons name={protocol.icon as any} size={24} color={completed[protocol.id] ? Colors.dark.success : Colors.dark.secondary} />
            </View>
            <View style={styles.protocolInfo}>
              <Text style={[styles.protocolName, completed[protocol.id] && styles.protocolNameCompleted]}>{protocol.name}</Text>
              <Text style={styles.protocolDesc}>{protocol.description}</Text>
            </View>
            <View style={styles.protocolMeta}>
              <Text style={styles.protocolDuration}>{protocol.duration}</Text>
              {completed[protocol.id] && <Ionicons name="checkmark-circle" size={22} color={Colors.dark.success} />}
            </View>
          </TouchableOpacity>
        ))}
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
  videoSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  videoLabel: {
    color: Colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 1,
  },
  videoBox: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 8,
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    color: Colors.dark.background,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  videoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  videoLinkText: {
    color: Colors.dark.error,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },
  protocolsContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
    shadowColor: Colors.dark.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  protocolCardCompleted: {
    backgroundColor: Colors.dark.success + '20',
    borderColor: Colors.dark.success,
  },
  protocolIconBox: {
    marginRight: 16,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolName: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  protocolNameCompleted: {
    color: Colors.dark.success,
  },
  protocolDesc: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 2,
  },
  protocolMeta: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  protocolDuration: {
    color: Colors.dark.secondary,
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'right',
  },
}); 