import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface SoloLevelingWelcomeProps {
  visible: boolean;
  onClose: () => void;
  userName?: string | null;
}

export default function SoloLevelingWelcome({ visible, onClose, userName }: SoloLevelingWelcomeProps) {
  const [show, setShow] = useState(visible);
  const displayName = userName ? userName : 'Operator';

  useEffect(() => { setShow(visible); }, [visible]);

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.popup}>
          <Text style={styles.title}>SYSTEM MESSAGE</Text>
          <Text style={styles.typing}>
            {`Welcome ${displayName}!\n\nYou have been invited to test this app.\n\nThis app is your daily protocol system for mind, body, and spirit.\n\n`}
            <Text style={{ color: '#00f2ff' }}>Note: This app is under development. Features may change and data may reset.</Text>
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => { setShow(false); onClose(); }}>
            <Text style={styles.buttonText}>ENTER</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10,20,40,0.95)', justifyContent: 'center', alignItems: 'center' },
  popup: { width: '85%', borderRadius: 16, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#00f2ff', padding: 24, alignItems: 'center', shadowColor: '#00f2ff', shadowOpacity: 0.5, shadowRadius: 16 },
  title: { color: '#00f2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, letterSpacing: 2 },
  typing: { color: '#f8fafc', fontSize: 16, marginBottom: 24, textAlign: 'center', lineHeight: 24 },
  button: { backgroundColor: '#00f2ff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  buttonText: { color: '#1e293b', fontWeight: 'bold', fontSize: 16 }
}); 