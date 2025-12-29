/**
 * VideoPlayer - Video playback component with sage play controls
 * Implements Requirements 3.5, 3.6, 3.7
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { VideoSnippet } from '../types';

export interface VideoPlayerProps {
  snippet?: VideoSnippet;
  videoPath?: string;
  visible: boolean;
  onClose: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  style?: any;
}

export function VideoPlayer({
  snippet,
  videoPath,
  visible,
  onClose,
  autoPlay = true,
  showControls = true,
  style,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  
  const videoRef = useRef<Video>(null);
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const screenDimensions = Dimensions.get('window');

  // Get video source from either snippet or direct path
  const videoSource = snippet?.filePath || videoPath;

  useEffect(() => {
    if (visible && autoPlay) {
      setIsPlaying(true);
    }
  }, [visible, autoPlay]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControlsOverlay && isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        hideControls();
      }, 3000) as unknown as NodeJS.Timeout;
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControlsOverlay, isPlaying]);

  const hideControls = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowControlsOverlay(false);
    });
  };

  const showControlsOverlayFunc = () => {
    setShowControlsOverlay(true);
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
        showControlsOverlayFunc();
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = async (seekPosition: number) => {
    if (videoRef.current && duration > 0) {
      const seekTime = (seekPosition * duration) / 100;
      await videoRef.current.setPositionAsync(seekTime * 1000);
      setPosition(seekTime);
    }
  };

  const handleVideoPress = () => {
    if (showControlsOverlay) {
      hideControls();
    } else {
      showControlsOverlayFunc();
    }
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }
    setIsPlaying(false);
    onClose();
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        showControlsOverlayFunc();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Video */}
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            source={{ uri: videoSource }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={isPlaying}
            isLooping={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
          
          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingSpinner}>
                <Ionicons name="play-circle" size={64} color={Colors.sage} />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Controls Overlay */}
        {showControls && (
          <Animated.View 
            style={[styles.controlsOverlay, { opacity: fadeAnimation }]}
            pointerEvents={showControlsOverlay ? 'auto' : 'none'}
          >
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={Colors.white} />
              </TouchableOpacity>
              
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>
                  {snippet?.calendarDate ? 
                    new Date(snippet.calendarDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 
                    'Video Snippet'
                  }
                </Text>
                {snippet?.note && (
                  <Text style={styles.videoNote} numberOfLines={2}>
                    {snippet.note}
                  </Text>
                )}
              </View>
            </View>

            {/* Center Play/Pause Button */}
            <View style={styles.centerControls}>
              <TouchableOpacity 
                onPress={handlePlayPause}
                style={styles.playPauseButton}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={48} 
                  color={Colors.white} 
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(position)}
              </Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <Text style={styles.timeText}>
                {formatTime(duration)}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textPrimary, // Black background
  },
  
  // Video
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingSpinner: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: BorderRadius.circle,
    padding: Spacing.lg,
  },
  
  // Controls Overlay
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Top Controls
  topControls: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: Spacing.xxl + 20, // Account for status bar
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BorderRadius.circle,
  },
  videoInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  videoTitle: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '600',
  },
  videoNote: {
    ...Typography.body,
    color: Colors.white,
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  
  // Center Controls
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sage, // Sage play controls
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
  
  // Bottom Controls
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 4,
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.sage, // Sage progress bar
    borderRadius: 2,
  },
});