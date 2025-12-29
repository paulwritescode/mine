/**
 * PostCapture - Screen for processing and reviewing captured video
 * Implements enhanced user feedback with progress indicators and toast notifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { CaptureStackParamList } from '../navigation/types';
import { Colors, Spacing, BorderRadius, Typography, TouchTargets } from '../design-system';
import { MineButton } from '../components/MineButton';
import { VideoService, VideoProcessingProgress } from '../services/VideoService';

type Props = StackScreenProps<CaptureStackParamList, 'PostCapture'>;

export function PostCapture({ navigation, route }: Props) {
  const { videoPath, projectId } = route.params;
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState<VideoProcessingProgress>({ progress: 0, stage: 'compressing' });
  const [error, setError] = useState<string | null>(null);
  const [processedVideo, setProcessedVideo] = useState<any>(null);

  const videoService = VideoService.getInstance();

  useEffect(() => {
    processVideo();
  }, []);

  const processVideo = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await videoService.processRecordedVideo(
        videoPath,
        {
          duration: 2, // Default duration, could be passed from camera
          projectId,
          date: new Date().toISOString().split('T')[0],
        },
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setProcessedVideo(result);
      setIsProcessing(false);
      
      // Show success feedback
      videoService.showSuccessToast('Video captured successfully!');
      
    } catch (err) {
      console.error('Video processing failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to process video');
      setIsProcessing(false);
      
      // Show error feedback
      videoService.showErrorToast('Failed to process video. Please try again.');
    }
  };

  const retryProcessing = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    processVideo();
  };

  const navigateBack = () => {
    navigation.navigate('CameraView', { projectId });
  };

  const navigateToProjects = () => {
    // Navigate back to projects list
    navigation.getParent()?.navigate('ProjectsStack', { 
      screen: 'ProjectDetail', 
      params: { projectId } 
    });
  };

  const getStageText = (stage: string): string => {
    switch (stage) {
      case 'compressing':
        return 'Compressing video...';
      case 'generating_thumbnail':
        return 'Generating thumbnail...';
      case 'saving':
        return 'Saving to project...';
      case 'complete':
        return 'Complete!';
      default:
        return 'Processing...';
    }
  };

  const renderProcessingView = () => (
    <View style={styles.processingContainer}>
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <ActivityIndicator size="large" color={Colors.sage} />
          <Text style={styles.progressText}>{Math.round(progress.progress)}%</Text>
        </View>
        
        <Text style={styles.stageText}>{getStageText(progress.stage)}</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress.progress}%` }
            ]} 
          />
        </View>
      </View>
      
      <Text style={styles.processingMessage}>
        Please wait while we process your video...
      </Text>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={64} color={Colors.error} />
      <Text style={styles.errorTitle}>Processing Failed</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      
      <View style={styles.errorActions}>
        <MineButton
          variant="secondary"
          onPress={retryProcessing}
          style={styles.retryButton}
        >
          Try Again
        </MineButton>
        
        <MineButton
          variant="primary"
          onPress={navigateBack}
        >
          Capture New Video
        </MineButton>
      </View>
    </View>
  );

  const renderSuccessView = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
      </View>
      
      <Text style={styles.successTitle}>Video Captured!</Text>
      <Text style={styles.successMessage}>
        Your video has been successfully saved to your project.
      </Text>
      
      <View style={styles.successActions}>
        <MineButton
          variant="secondary"
          onPress={navigateBack}
          style={styles.actionButton}
        >
          Capture Another
        </MineButton>
        
        <MineButton
          variant="primary"
          onPress={navigateToProjects}
          style={styles.actionButton}
        >
          View Project
        </MineButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={navigateBack}
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Processing Video</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {isProcessing && renderProcessingView()}
        {error && renderErrorView()}
        {!isProcessing && !error && processedVideo && renderSuccessView()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    borderRadius: TouchTargets.minimum / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: TouchTargets.minimum,
  },
  
  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  
  // Processing View
  processingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  progressText: {
    ...Typography.h3,
    color: Colors.sage,
    position: 'absolute',
    fontWeight: 'bold',
  },
  stageText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.sage,
    borderRadius: 2,
  },
  processingMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  
  // Error View
  errorContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorActions: {
    width: '100%',
    gap: Spacing.md,
  },
  retryButton: {
    marginBottom: Spacing.sm,
  },
  
  // Success View
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  successMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  successActions: {
    width: '100%',
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});