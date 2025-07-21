import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COMPLETION_KEY = 'spirit_prayer_completed_date';
const XP_REWARD = 50;

const BIBLE_VERSES = [
  {
    text: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
  },
  {
    text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    reference: 'Joshua 1:9',
  },
  {
    text: 'The Lord is my strength and my shield; my heart trusts in him, and he helps me.',
    reference: 'Psalm 28:7',
  },
  {
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    reference: 'Isaiah 40:31',
  },
  {
    text: 'For God gave us a spirit not of fear but of power and love and self-control.',
    reference: '2 Timothy 1:7',
  },
  {
    text: 'The joy of the Lord is your strength.',
    reference: 'Nehemiah 8:10',
  },
  {
    text: 'Be on your guard; stand firm in the faith; be courageous; be strong.',
    reference: '1 Corinthians 16:13',
  },
];

function getRandomVerse() {
  return BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
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

export default function SpiritScreen() {
  const { completeProtocol } = useAppContext();
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [verse, setVerse] = useState(getRandomVerse());

  useEffect(() => {
    // Check completion state
    const checkCompleted = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const stored = await AsyncStorage.getItem(COMPLETION_KEY);
      setCompleted(stored === today);
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

  const handleComplete = async () => {
    if (completed) return;
    setCompleting(true);
    await completeProtocol('spirit-prayer', XP_REWARD);
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(COMPLETION_KEY, today);
    setCompleted(true);
    setCompleting(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Bible Verse Block */}
      <View style={styles.verseBlock}>
        <Ionicons name="book" size={28} color={Colors.dark.primary} style={{ marginBottom: 8 }} />
        <Text style={styles.verseText}>
          “{verse.text}”
        </Text>
        <Text style={styles.verseRef}>{verse.reference}</Text>
      </View>

      {/* Gratitude Block */}
      <View style={styles.cardBlock}>
        <View style={styles.cardHeader}>
          <Ionicons name="journal-outline" size={22} color={Colors.dark.secondary} style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Gratitude Practice</Text>
        </View>
        <Text style={styles.cardDesc}>
          Write down 5 things you are grateful for today (in your own notebook).
        </Text>
      </View>

      {/* Prayer/Meditation Block */}
      <View style={styles.cardBlock}>
        <View style={styles.cardHeader}>
          <Ionicons name="leaf-outline" size={22} color={Colors.dark.success} style={{ marginRight: 8 }} />
          <Text style={styles.cardTitle}>Prayer / Meditation</Text>
        </View>
        <Text style={styles.cardDesc}>
          Spend 10 minutes in prayer or silent meditation.
        </Text>
        {completed ? (
          <View style={styles.completedContainer}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.dark.success} />
            <Text style={styles.completedText}>Completed</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Ionicons name="time" size={18} color={Colors.dark.primary} style={{ marginRight: 6 }} />
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
            <Ionicons name="checkmark-circle" size={20} color={Colors.dark.background} />
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
    paddingHorizontal: 20,
  },
  verseBlock: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    padding: 20,
    marginBottom: 28,
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  verseText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  verseRef: {
    color: Colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cardBlock: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 18,
    marginBottom: 24,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDesc: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 2,
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  completedText: {
    color: Colors.dark.success,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
  },
  completedSubtext: {
    fontSize: 13,
    color: Colors.dark.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.success,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: Colors.dark.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 16,
  },
  completeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.dark.background,
    marginLeft: 8,
  },
}); 