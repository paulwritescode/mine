/**
 * CameraView - Video capture screen with enhanced UI
 * Implements Requirements 2.1, 2.2, 2.3
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Spacing, BorderRadius, Typography, TouchTargets } from '@/src/design-system';
import { MineButton } from '@/src/components/MineButton';

export default function CameraScreen() {
  const { projectId, date } = useLocalSearchParams<{ projectId?: string; date?: string }>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(2); // Default 2 seconds
  
  const cameraRef = useRef<CameraView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const requestAllPermissions = async () => {
    const cameraResult = await requestCameraPermission();
    const microphoneResult = await requestMicrophonePermission();
    
    if (!cameraResult.granted || !microphoneResult.granted) {
      Alert.alert(
        'Permissions Required',
        'Mine needs both camera and microphone access to record videos with audio.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: requestAllPermissions }
        ]
      );
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      setIsRecording(true);
      setCountdown(selectedDuration);
      startPulseAnimation();

      // Start countdown
      let timeLeft = selectedDuration;
      countdownInterval.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          stopRecording();
        }
      }, 1000) as any;

      // Start actual recording
      const video = await cameraRef.current.recordAsync({
        maxDuration: selectedDuration,
      });

      if (video) {
        console.log('Recording finished:', video.uri);
        // Navigate to post-capture screen
        router.push(`/post-capture?videoPath=${encodeURIComponent(video.uri)}&projectId=${projectId || ''}&date=${date || ''}`);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Camera Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
      stopPulseAnimation();
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      setCountdown(0);
      stopPulseAnimation();
      
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleDurationSelect = async (duration: number) => {
    if (isRecording) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDuration(duration);
  };

  const toggleCameraFacing = async () => {
    if (isRecording) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const renderDurationButton = (duration: number) => {
    const isSelected = selectedDuration === duration;
    return (
      <TouchableOpacity
        key={duration}
        onPress={() => handleDurationSelect(duration)}
        style={[
          styles.durationButton,
          isSelected && styles.durationButtonSelected
        ]}
        disabled={isRecording}
      >
        <Text style={[
          styles.durationText,
          isSelected && styles.durationTextSelected
        ]}>
          {duration}s
        </Text>
      </TouchableOpacity>
    );
  };

  if (!cameraPermission || !microphonePermission) {
    // Permissions are still loading
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    // Camera or microphone permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionContent}>
            <Ionicons name="videocam-off" size={64} color={Colors.error} />
            <Text style={styles.permissionTitle}>Permissions Required</Text>
            <Text style={styles.permissionMessage}>
              Mine needs both camera and microphone access to record videos with audio.
            </Text>
            <MineButton onPress={requestAllPermissions} style={styles.permissionButton}>
              Enable Permissions
            </MineButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera Preview */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
      />

      {/* Overlay Controls */}
      <View style={styles.overlay}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          {countdown > 0 && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Camera Flip Button */}
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
            disabled={isRecording}
          >
            <Ionicons name="camera-reverse" size={24} color={Colors.white} />
          </TouchableOpacity>

          {/* Duration Selection - Horizontal */}
          <View style={styles.durationContainer}>
            {[1, 2, 3].map(renderDurationButton)}
          </View>

          {/* Record Button */}
          <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive
              ]} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
  },
  camera: {
    flex: 1,
  },
  
  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 60, // Account for status bar
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
  },
  
  // Top Controls
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    borderRadius: TouchTargets.minimum / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    ...Typography.h1,
    color: Colors.white,
    fontWeight: 'bold',
  },
  
  // Bottom Controls
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  // Camera Flip Button
  flipButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    borderRadius: TouchTargets.minimum / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Duration Selection - Horizontal
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  durationButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.circle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 40,
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: Colors.sage,
  },
  durationText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  durationTextSelected: {
    color: Colors.white,
  },
  
  // Record Button
  recordButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  recordButtonActive: {
    backgroundColor: Colors.error,
  },
  recordButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  recordButtonInnerActive: {
    borderRadius: 3,
  },
  
  // Permission Screen
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  permissionContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  permissionTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  permissionMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  permissionButton: {
    minWidth: 200,
  },
});