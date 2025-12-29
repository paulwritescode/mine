/**
 * DualToneProjectCard - Signature Soft-Tech project card
 * 
 * Features:
 * - Fully mint background with black text
 * - Left-aligned title using Nanum Pen Script font
 * - Softer border radius (16px)
 * - Progress indicator with black fill and gray track
 * - Scale animation on press
 * - Clean design without shadows or separators
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';

import { useTheme } from '../design-system';
import { Project } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface DualToneProjectCardProps {
  project: Project;
  snippetCount?: number;
  totalDuration?: number;
  progress?: number; // Progress percentage (0-100)
  onPress?: (project: Project) => void;
  style?: ViewStyle;
}

export function DualToneProjectCard({ 
  project, 
  snippetCount = 0,
  totalDuration = 0,
  progress = 0,
  onPress, 
  style 
}: DualToneProjectCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  // Load fonts locally to ensure they're available
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePress = () => {
    if (onPress) {
      runOnJS(onPress)(project);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = createStyles(theme, fontsLoaded);

  // Show loading state if fonts aren't loaded yet
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.topSection}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.detailsContainer}>
            <Text style={styles.metadata}>
              {snippetCount} Clips | {formatDuration(totalDuration)}
            </Text>
            <Text style={styles.lastModified}>
              {formatDate(project.updatedAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {/* Top Section - Reduced height for title only */}
      <View style={styles.topSection}>
        <Text style={styles.projectTitle} numberOfLines={2}>
          {project.name}
        </Text>
      </View>

      {/* Bottom Section - Two columns: details left, progress right */}
      <View style={styles.bottomSection}>
        {/* Left side - Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.metadata}>
            {snippetCount} Clips | {formatDuration(totalDuration)}
          </Text>
          <Text style={styles.lastModified}>
            Updated -{formatDate(project.updatedAt)}
          </Text>
        </View>
        
        {/* Right side - Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.circularProgress}>
            {/* Background circle */}
            <View style={styles.progressBackground} />
            {/* Progress circle */}
            <View style={[
              styles.progressCircle,
              {
                transform: [{ rotate: `${-90 + (progress * 3.6)}deg` }]
              }
            ]} />
            {/* Center content */}
            <View style={styles.progressCenter}>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const createStyles = (theme: any, fontsLoaded: boolean) => StyleSheet.create({
  container: {
    height: 110,
    borderRadius: theme.borderRadius.md, // 16px rounded corners
    overflow: 'hidden', // Ensures children respect the border radius
    backgroundColor: theme.colors.mint, // Set background color here
    // Removed shadows for cleaner look
  },
  topSection: {
    height: 70, // Reduced height - just for title
    backgroundColor: theme.colors.mint,
    justifyContent: 'center',
    alignItems: 'flex-start', // Left align content
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sunburstOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  projectTitle: {
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System', // Fallback to system font
    fontSize: 34, // Slightly larger to make the font more visible
    fontWeight: 'normal', // Remove bold as Nanum Pen Script is already stylized
    color: theme.colors.black,
    textAlign: 'left', // Left aligned
    zIndex: 1,
    lineHeight: 38,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.black,
    fontWeight: '600',
  },
  bottomSection: {
    height: 25, // Fixed height instead of flex: 1
    backgroundColor: theme.colors.mint,
    flexDirection: 'row', // Two columns layout
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  detailsContainer: {
    flex: 1, // Takes available space on the left
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  metadata: {
    ...theme.typography.caption,
    color: theme.colors.black,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  lastModified: {
    fontSize: 9, // Smaller than caption (12px)
    fontWeight: 'normal',
    fontFamily: 'Inter-Regular',
    color: theme.colors.black,
    opacity: 0.6,
    lineHeight: 14,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md, // Space from details
  },
  circularProgress: {
    width: 50,
    height: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    borderColor: '#eeeeeeff', // Gray color for track
  },
  progressCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: theme.colors.black, // Black for progress fill
    borderRightColor: theme.colors.black,
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.black,
  },
});

// Helper functions
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}