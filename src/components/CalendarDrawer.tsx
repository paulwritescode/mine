/**
 * CalendarDrawer - Bottom drawer for video details and actions
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { VideoSnippet } from '../types';
import { MineButton } from './MineButton';

export interface CalendarDrawerProps {
  visible: boolean;
  selectedDate: Date | null;
  snippet: VideoSnippet | null;
  isToday: boolean;
  onClose: () => void;
  onPlayVideo: (snippet: VideoSnippet) => void;
  onRecordVideo: (date: Date) => void;
  onDeleteVideo: (snippet: VideoSnippet) => void;
}

const DRAWER_HEIGHT = 400;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function CalendarDrawer({
  visible,
  selectedDate,
  snippet,
  isToday,
  onClose,
  onPlayVideo,
  onRecordVideo,
  onDeleteVideo,
}: CalendarDrawerProps) {
  const slideAnimation = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: DRAWER_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handlePlayVideo = async () => {
    if (snippet) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPlayVideo(snippet);
    }
  };

  const handleRecordVideo = async () => {
    if (selectedDate) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onRecordVideo(selectedDate);
    }
  };

  const handleDeleteVideo = async () => {
    if (snippet) {
      Alert.alert(
        'Delete Video',
        'Are you sure you want to delete this video? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onDeleteVideo(snippet);
            },
          },
        ]
      );
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!visible || !selectedDate) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnimation,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateY: slideAnimation }],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.dateTitle}>{formatDate(selectedDate)}</Text>
            {isToday && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayText}>Today</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {snippet ? (
            // Video exists
            <View style={styles.videoSection}>
              {/* Video Preview */}
              <View style={styles.videoPreview}>
                {snippet.thumbnailPath ? (
                  <Image source={{ uri: snippet.thumbnailPath }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.placeholderThumbnail}>
                    <Ionicons name="videocam" size={32} color={Colors.textSecondary} />
                  </View>
                )}
                <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
                  <Ionicons name="play" size={24} color={Colors.white} />
                </TouchableOpacity>
              </View>

              {/* Video Info */}
              <View style={styles.videoInfo}>
                <View style={styles.videoMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{formatDuration(snippet.duration)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>
                      {snippet.recordedDate.toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {snippet.note && (
                  <View style={styles.noteSection}>
                    <Text style={styles.noteLabel}>Note</Text>
                    <Text style={styles.noteText}>{snippet.note}</Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <MineButton
                  onPress={handlePlayVideo}
                  style={styles.primaryAction}
                >
                  <Ionicons name="play" size={20} color={Colors.white} />
                  <Text style={styles.primaryActionText}>Play Video</Text>
                </MineButton>

                {isToday && (
                  <View style={styles.todayActions}>
                    <MineButton
                      onPress={handleRecordVideo}
                      style={styles.secondaryAction}
                    >
                      <Ionicons name="videocam" size={20} color={Colors.white} />
                      <Text style={styles.secondaryActionText}>Record New</Text>
                    </MineButton>
                    <TouchableOpacity
                      onPress={handleDeleteVideo}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ) : (
            // No video exists
            <View style={styles.emptySection}>
              <View style={styles.emptyIcon}>
                <Ionicons name="videocam-outline" size={48} color={Colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No Video Recorded</Text>
              <Text style={styles.emptyMessage}>
                {isToday
                  ? "You haven't recorded a video for today yet."
                  : "No video was recorded on this date."}
              </Text>

              {isToday && (
                <MineButton
                  onPress={handleRecordVideo}
                  style={styles.recordButton}
                >
                  <Ionicons name="videocam" size={20} color={Colors.white} />
                  <Text style={styles.recordButtonText}>Record Video</Text>
                </MineButton>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dateTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  todayBadge: {
    backgroundColor: Colors.lavender,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  todayText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Video Section
  videoSection: {
    flex: 1,
  },
  videoPreview: {
    position: 'relative',
    height: 120,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  videoInfo: {
    marginBottom: Spacing.lg,
  },
  videoMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  noteSection: {
    backgroundColor: Colors.offWhite,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  noteLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  noteText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  primaryActionText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  todayActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  secondaryActionText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  deleteButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.offWhite,
  },

  // Empty Section
  emptySection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  recordButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
});