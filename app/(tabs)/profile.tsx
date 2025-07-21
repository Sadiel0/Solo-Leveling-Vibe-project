import { XPBar } from '@/components/XPBar';
import Colors from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { calculateNextLevelXP, getRankTitle } from '@/utils/gameLogic';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROFILE_PIC_KEY = 'profile_picture_uri';

export default function ProfileScreen() {
  const { userStats, userName, setUserName } = useAppContext();
  const nextLevelXP = calculateNextLevelXP(userStats.level);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loadingPic, setLoadingPic] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState(userName || '');

  useEffect(() => {
    const loadPic = async () => {
      const uri = await AsyncStorage.getItem(PROFILE_PIC_KEY);
      setProfilePic(uri);
      setLoadingPic(false);
    };
    loadPic();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setProfilePic(result.assets[0].uri);
      await AsyncStorage.setItem(PROFILE_PIC_KEY, result.assets[0].uri);
    }
  };

  const handleSaveName = async () => {
    if (nameInput.trim().length > 0) {
      await setUserName(nameInput.trim());
      setShowNameModal(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Name Modal */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: Colors.dark.surface, padding: 28, borderRadius: 16, width: 320 }}>
            <Text style={{ color: Colors.dark.primary, fontWeight: 'bold', fontSize: 18, marginBottom: 16, textAlign: 'center' }}>Update your name</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor={Colors.dark.text}
              style={{ backgroundColor: Colors.dark.background, color: Colors.dark.text, borderRadius: 8, padding: 12, marginBottom: 18, fontSize: 16 }}
              autoFocus
            />
            <Button title="Save" onPress={handleSaveName} color={Colors.dark.primary} />
          </View>
        </View>
      </Modal>
      {/* System Header */}
      <View style={styles.systemHeader}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            {profilePic && !loadingPic ? (
              <Image source={{ uri: profilePic }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Colors.dark.primary} />
              </View>
            )}
            <View style={styles.avatarEditOverlay}>
              <Ionicons name="camera" size={20} color={Colors.dark.background} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: Colors.dark.primary, fontWeight: 'bold', fontSize: 20, marginRight: 8 }}>
              {userName ? userName : 'Operator'}
            </Text>
            <TouchableOpacity onPress={() => { setNameInput(userName || ''); setShowNameModal(true); }}>
              <Ionicons name="pencil" size={18} color={Colors.dark.primary} />
            </TouchableOpacity>
          </View>
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
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    resizeMode: 'cover',
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.dark.background,
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
}); 