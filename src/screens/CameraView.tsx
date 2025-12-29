/**
 * CameraView - Video capture screen with enhanced UI
 * Implements Requirements 2.1, 2.2, 2.3
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { CaptureStackParamList } from '../navigation/types';
import { Colors, Spacing, BorderRadius, Typography, TouchTargets } from '../design-system';
import { MineButton } from '../components/MineButton';

type Props = StackScreenProps<CaptureStackParamList, 'CameraView'>;

export function CameraView({ navigation, route }: Props) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(2); // Default 2 seconds
  
  const camera = useRef<Camera>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestCameraPermission();
    }
  }, [hasPermission]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    const permission = await requestPermission();
    if (!permission) {
      Alert.alert(
        'Camera Permission Required',
        'Mine needs camera access to record your daily video moments. Please enable camera permissions in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {/* TODO: Open settings */} }
        ]
      );
    }
  };

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
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startRecording = async () => {
    if (!camera.current || isRecording) return;

    try {
      // Haptic feedback for record start
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
      await camera.current.startRecording({
        onRecordingFinished: (video) => {
          console.log('Recording finished:', video.path);
          // Navigate to post-capture screen
          navigation.navigate('PostCapture', {
            videoPath: video.path,
            projectId: route.params?.projectId || '',
          });
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          Alert.alert('Recording Error', 'Failed to record video. Please try again.');
          setIsRecording(false);
          stopPulseAnimation();
        },
      });

    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Camera Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
      stopPulseAnimation();
    }
  };

  const stopRecording = async () => {
    if (!camera.current || !isRecording) return;

    try {
      // Haptic feedback for record stop
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await camera.current.stopRecording();
      setIsRecording(false);
      setCountdown(0);
      stopPulseAnimation();
      
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const renderDurationSelector = () => (
    <View style={styles.durationSelector}>
      {[1, 2, 3].map((duration) => (
        <TouchableOpacity
          key={duration}
          style={[
            styles.durationChip,
            selectedDuration === duration && styles.durationChipSelected
          ]}
          onPress={() => setSelectedDuration(duration)}
          disabled={isRecording}
        >
          <Text style={[
            styles.durationText,
            selectedDuration === duration && styles.durationTextSelected
          ]}>
            {duration}s
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecordButton = () => (
    <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording && styles.recordButtonActive
        ]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={!device}
      >
        <Ionicons 
          name={isRecording ? "stop" : "videocam"} 
          size={32} 
          color={Colors.white} 
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCountdown = () => {
    if (!isRecording || countdown <= 0) return null;
    
    return (
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
    );
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.textPrimary} />
        <View style={styles.permissionContent}>
          <Ionicons name="videocam-off" size={64} color={Colors.error} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionMessage}>
            Mine needs camera access to record your daily video moments.
          </Text>
          <MineButton onPress={requestCameraPermission} style={styles.permissionButton}>
            Enable Camera
          </MineButton>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.textPrimary} />
        <View style={styles.errorContent}>
          <Ionicons name="videocam-off" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Camera Unavailable</Text>
          <Text style={styles.errorMessage}>
            No camera device found. Please check your device and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera Preview */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />
      
      {/* Black Overlay for Focus */}
      <View style={styles.overlay} />
      
      {/* Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
      </SafeAreaView>
      
      {/* Countdown Display */}
      {renderCountdown()}
      
      {/* Bottom Controls */}
      <SafeAreaView style={styles.bottomControls}>
        <View style={styles.controlsContainer}>
          {renderDurationSelector()}
          {renderRecordButton()}
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  // Permission Screen
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
  },
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    ...Typography.h2,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  permissionMessage: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    marginTop: Spacing.lg,
  },
  
  // Error Screen
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
  },
  errorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorTitle: {
    ...Typography.h2,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  
  // Controls
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    borderRadius: TouchTargets.minimum / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlsContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Duration Selector
  durationSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  durationChipSelected: {
    borderColor: Colors.sage,
    backgroundColor: Colors.sageLight,
  },
  durationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  durationTextSelected: {
    color: Colors.sage,
  },
  
  // Record Button
  recordButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: TouchTargets.fab,
    height: TouchTargets.fab,
    borderRadius: TouchTargets.fab / 2,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: Colors.error,
  },
  
  // Countdown
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
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
  
  // Placeholder for layout balance
  placeholder: {
    width: 80, // Same width as duration selector
  },
});