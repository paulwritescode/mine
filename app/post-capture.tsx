/**
 * PostCapture - Video processing and note addition screen
 * Implements Requirements 2.4, 2.5, 10.1, 10.2
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Spacing, Typography, TouchTargets } from '@/src/design-system';
import { MineButton, MineInput, VideoPlayer, MineInputRef, KeyboardAvoidingContainer, KeyboardSpacer } from '@/src/components';
import { SnippetService } from '@/src/services/SnippetService';
import { VideoService } from '@/src/services/VideoService';
import { useKeyboard } from '@/src/hooks/useKeyboard';

export default function PostCapture() {
  const { videoPath, projectId, date } = useLocalSearchParams<{ 
    videoPath: string; 
    projectId: string; 
    date?: string; 
  }>();
  
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const noteInputRef = useRef<MineInputRef>(null);
  const { isVisible: keyboardVisible, dismiss: dismissKeyboard } = useKeyboard();

  const snippetService = SnippetService.getInstance();
  const videoService = VideoService.getInstance();

  useEffect(() => {
    // Video processing will happen when user saves
    // No automatic processing on mount
  }, [videoPath]);

  const processVideo = async () => {
    try {
      setProcessing(true);
      
      // Process the video using the correct method name
      await videoService.processRecordedVideo(videoPath, {
        duration: 2, // Default duration, could be passed from camera
        projectId,
        date: date || new Date().toISOString().split('T')[0],
      });
      
    } catch (error) {
      console.error('Failed to process video:', error);
      Alert.alert('Processing Error', 'Failed to process video. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!videoPath || !projectId) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    // Dismiss keyboard before saving
    dismissKeyboard();

    try {
      setProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Process and save the video with note
      await videoService.processRecordedVideo(videoPath, {
        duration: 2, // This should come from actual video duration
        projectId,
        date: date || new Date().toISOString().split('T')[0],
        note: note.trim() || undefined,
      });

      // Navigate back to project
      router.replace(`/project/${projectId}`);
      
    } catch (error) {
      console.error('Failed to save snippet:', error);
      Alert.alert('Save Error', 'Failed to save video. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const navigateBack = () => {
    router.push(`/camera?projectId=${projectId}&date=${date}`);
  };

  const handlePreview = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPreview(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={navigateBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Add Details</Text>
        
        <TouchableOpacity
          onPress={handlePreview}
          style={styles.previewButton}
        >
          <Ionicons name="play" size={24} color={Colors.sage} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingContainer
        containerStyle={styles.content}
        contentContainerStyle={styles.scrollContent}
        hasToolbar={false}
        verticalOffset={62} // Account for button height + padding
        showBlurBackground={false} // We'll handle the button positioning manually
      >
        {/* Video Preview Thumbnail */}
        <View style={styles.videoPreview}>
          <TouchableOpacity
            onPress={handlePreview}
            style={styles.videoThumbnail}
          >
            <Ionicons name="play-circle" size={64} color={Colors.sage} />
            <Text style={styles.previewText}>Tap to preview</Text>
          </TouchableOpacity>
        </View>

        {/* Note Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a Note</Text>
          <Text style={styles.sectionDescription}>
            Capture the moment with a brief note (optional)
          </Text>
          
          <MineInput
            ref={noteInputRef}
            value={note}
            onChangeText={(text) => {
              setNote(text);
            }}
            placeholder="What happened in this moment?"
            multiline
            numberOfLines={4}
            maxLength={500}
            style={styles.noteInput}
            returnKeyType="done"
            autoCapitalize="sentences"
            autoCorrect={true}
            onSubmitEditing={() => {
              dismissKeyboard();
            }}
          />
          
          <Text style={styles.characterCount}>
            {note.length}/500 characters
          </Text>
        </View>

        {/* Date Info */}
        {date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={20} color={Colors.sage} />
              <Text style={styles.dateText}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="bulb" size={16} color={Colors.sage} />
              <Text style={styles.tipText}>
                Notes help you remember the context of your videos
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="search" size={16} color={Colors.sage} />
              <Text style={styles.tipText}>
                You can search through your notes later
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="heart" size={16} color={Colors.sage} />
              <Text style={styles.tipText}>
                Capture emotions, locations, or special moments
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingContainer>

      {/* Save Button - positioned above keyboard */}
      <View style={styles.buttonContainer}>
        <MineButton
          onPress={handleSave}
          loading={processing}
          style={styles.saveButton}
        >
          Save Video
        </MineButton>
      </View>

      {/* Keyboard spacer to push button above keyboard */}
      <KeyboardSpacer />

      {/* Video Preview Modal */}
      {showPreview && videoPath && (
        <VideoPlayer
          videoPath={videoPath}
          visible={showPreview}
          onClose={() => setShowPreview(false)}
          autoPlay={true}
        />
      )}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  previewButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  
  // Video Preview
  videoPreview: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  videoThumbnail: {
    height: 200,
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  previewText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  
  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 21,
  },
  
  // Note Input
  noteInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  
  // Date
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.offWhite,
    borderRadius: 8,
  },
  dateText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  
  // Tips
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  tipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 21,
  },
  
  // Button Container - positioned above keyboard
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    width: '100%',
  },
});