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
import { VideoView, useVideoPlayer } from 'expo-video';
import Slider from '@react-native-community/slider';
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
  showNoteOverlay?: boolean;
  autoPlayNext?: boolean;
  onVideoEnd?: () => void;
  onNextVideo?: () => void;
  onPreviousVideo?: () => void;
  hasNextVideo?: boolean;
  hasPreviousVideo?: boolean;
  style?: any;
}

export function VideoPlayer({
  snippet,
  videoPath,
  visible,
  onClose,
  autoPlay = true,
  showControls = true,
  showNoteOverlay = false,
  autoPlayNext = false,
  onVideoEnd,
  onNextVideo,
  onPreviousVideo,
  hasNextVideo = false,
  hasPreviousVideo = false,
  style,
}: VideoPlayerProps) {
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const volumeAnimation = useRef(new Animated.Value(0)).current;
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const screenDimensions = Dimensions.get('window');

  // Get video source from either snippet or direct path
  const videoSource = snippet?.filePath || videoPath;

  // Create video player instance
  const player = useVideoPlayer(videoSource || '', (player) => {
    if (autoPlay) {
      player.play();
    }
  });

  if (!videoSource) {
    return null; // Don't render if no video source
  }

  useEffect(() => {
    if (visible && autoPlay) {
      player.play();
    }
  }, [visible, autoPlay, player]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControlsOverlay && player.playing) {
      controlsTimeout.current = setTimeout(() => {
        hideControls();
      }, 3000) as unknown as NodeJS.Timeout;
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControlsOverlay, player.playing]);

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
    
    if (player.playing) {
      player.pause();
      showControlsOverlayFunc();
    } else {
      player.play();
    }
  };

  const handleSeek = async (seekPosition: number) => {
    if (player.duration > 0) {
      const seekTime = (seekPosition / 100) * player.duration;
      player.seekTo(seekTime);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    showControlsOverlayFunc();
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const handleVolumeToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (player.muted) {
      player.muted = false;
    } else {
      player.muted = true;
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    player.volume = newVolume;
    player.muted = newVolume === 0;
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
    
    Animated.timing(volumeAnimation, {
      toValue: showVolumeSlider ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleNextVideo = async () => {
    if (hasNextVideo && onNextVideo) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onNextVideo();
    }
  };

  const handlePreviousVideo = async () => {
    if (hasPreviousVideo && onPreviousVideo) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPreviousVideo();
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
      
      if (!isSeeking) {
        setPosition(status.positionMillis / 1000);
      }
      
      setDuration(status.durationMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        showControlsOverlayFunc();
        
        // Handle auto-play next video for timeline sequences
        if (autoPlayNext && hasNextVideo && onNextVideo) {
          setTimeout(() => {
            onNextVideo();
          }, 1000); // 1 second delay before auto-playing next
        }
        
        // Call onVideoEnd callback if provided
        if (onVideoEnd) {
          onVideoEnd();
        }
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
            volume={isMuted ? 0 : volume}
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

          {/* Note Overlay */}
          {showNoteOverlay && snippet?.note && (
            <View style={styles.noteOverlay}>
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>{snippet.note}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Controls Overlay */}
        {showControls && (
          <Animated.View 
            style={[
              styles.controlsOverlay, 
              { 
                opacity: fadeAnimation,
                pointerEvents: showControlsOverlay ? 'auto' : 'none'
              }
            ]}
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
                {snippet?.note && !showNoteOverlay && (
                  <Text style={styles.videoNote} numberOfLines={2}>
                    {snippet.note}
                  </Text>
                )}
              </View>

              {/* Volume Control */}
              <View style={styles.volumeControls}>
                <TouchableOpacity 
                  onPress={toggleVolumeSlider}
                  style={styles.volumeButton}
                >
                  <Ionicons 
                    name={isMuted ? "volume-mute" : volume > 0.5 ? "volume-high" : "volume-low"} 
                    size={24} 
                    color={Colors.white} 
                  />
                </TouchableOpacity>
                
                {/* Volume Slider */}
                <Animated.View 
                  style={[
                    styles.volumeSliderContainer,
                    { 
                      opacity: volumeAnimation,
                      transform: [{ 
                        translateX: volumeAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [100, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={handleVolumeChange}
                    minimumTrackTintColor={Colors.sage}
                    maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  />
                </Animated.View>
              </View>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              {/* Previous Video Button */}
              {hasPreviousVideo && (
                <TouchableOpacity 
                  onPress={handlePreviousVideo}
                  style={styles.navigationButton}
                >
                  <Ionicons name="play-skip-back" size={32} color={Colors.white} />
                </TouchableOpacity>
              )}

              {/* Play/Pause Button */}
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

              {/* Next Video Button */}
              {hasNextVideo && (
                <TouchableOpacity 
                  onPress={handleNextVideo}
                  style={styles.navigationButton}
                >
                  <Ionicons name="play-skip-forward" size={32} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(position)}
              </Text>
              
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressSlider}
                  minimumValue={0}
                  maximumValue={100}
                  value={duration > 0 ? (position / duration) * 100 : 0}
                  onValueChange={(value) => {
                    if (!isSeeking) return;
                    const newPosition = (value / 100) * duration;
                    setPosition(newPosition);
                  }}
                  onSlidingStart={handleSeekStart}
                  onSlidingComplete={(value) => {
                    handleSeekEnd();
                    handleSeek(value);
                  }}
                  minimumTrackTintColor={Colors.sage}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                />
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
  
  // Note Overlay
  noteOverlay: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  noteContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  noteText: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
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
    marginRight: Spacing.md,
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
  
  // Volume Controls
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BorderRadius.circle,
  },
  volumeSliderContainer: {
    marginLeft: Spacing.md,
    width: 100,
  },
  volumeSlider: {
    width: 100,
    height: 40,
  },
  
  // Center Controls
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sage, // Sage play controls
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  navigationButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 40,
    justifyContent: 'center',
  },
  progressSlider: {
    width: '100%',
    height: 40,
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