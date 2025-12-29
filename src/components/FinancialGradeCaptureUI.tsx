/**
 * FinancialGradeCaptureUI - Premium capture interface with financial-grade aesthetics
 * 
 * Features:
 * - Pure black background for camera chrome
 * - Large white circle record button with black center (80px)
 * - Floating numeric countdown in top-right corner
 * - Clean Inter-Bold typography mimicking balance displays
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../design-system';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface FinancialGradeCaptureUIProps {
  isRecording: boolean;
  recordingDuration: number;
  onRecordPress: () => void;
  onStopPress: () => void;
  onClosePress: () => void;
  style?: ViewStyle;
}

export function FinancialGradeCaptureUI({
  isRecording,
  recordingDuration,
  onRecordPress,
  onStopPress,
  onClosePress,
  style
}: FinancialGradeCaptureUIProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  const recordButtonScale = useSharedValue(1);
  const pulseAnimation = useSharedValue(0);

  // Pulse animation for recording state
  useEffect(() => {
    if (isRecording) {
      pulseAnimation.value = withTiming(1, { duration: 1000 }, () => {
        pulseAnimation.value = withTiming(0, { duration: 1000 });
      });
    } else {
      pulseAnimation.value = 0;
    }
  }, [isRecording, pulseAnimation]);

  const handleRecordPressIn = () => {
    recordButtonScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleRecordPressOut = () => {
    recordButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handleRecordPress = () => {
    if (isRecording) {
      onStopPress();
    } else {
      onRecordPress();
    }
  };

  const recordButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.1]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.3, 0]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} />
      
      {/* Top Controls */}
      <View style={styles.topControls}>
        <Pressable style={styles.closeButton} onPress={onClosePress}>
          <Ionicons name="close" size={24} color={theme.colors.white} />
        </Pressable>
        
        {/* Financial-Grade Timer Display */}
        {isRecording && (
          <View style={styles.timerContainer}>
            <View style={styles.recordingIndicator} />
            <Text style={styles.timerText}>
              {formatRecordingTime(recordingDuration)}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Record Button */}
        <View style={styles.recordButtonContainer}>
          {/* Pulse ring for recording state */}
          {isRecording && (
            <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]} />
          )}
          
          <AnimatedPressable
            style={[styles.recordButton, recordButtonAnimatedStyle]}
            onPressIn={handleRecordPressIn}
            onPressOut={handleRecordPressOut}
            onPress={handleRecordPress}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerRecording
            ]} />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black, // Pure black background
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60, // Account for status bar
    paddingHorizontal: theme.spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: theme.spacing.sm,
  },
  timerText: {
    ...theme.typography.display, // Financial-grade display typography
    fontSize: 24, // Smaller than display but still prominent
    color: theme.colors.white,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 60, // Safe area padding
  },
  recordButtonContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: theme.touchTargets.fab + 20, // 100px
    height: theme.touchTargets.fab + 20, // 100px
    borderRadius: (theme.touchTargets.fab + 20) / 2,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  recordButton: {
    width: theme.touchTargets.fab, // 80px
    height: theme.touchTargets.fab, // 80px
    borderRadius: theme.touchTargets.fab / 2, // Perfect circle
    backgroundColor: theme.colors.white, // White circle
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.fab,
  },
  recordButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.black, // Black center
  },
  recordButtonInnerRecording: {
    borderRadius: 4, // Square when recording
    backgroundColor: '#FF0000', // Red when recording
  },
});