/**
 * CalendarCell - Calendar day cell component for timeline view
 */

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography, TouchTargets } from '../design-system';

export interface CalendarCellProps {
  date: Date;
  hasVideo: boolean;
  thumbnailUri?: string;
  isToday: boolean;
  onPress: (date: Date) => void;
  style?: ViewStyle;
}

export function CalendarCell({
  date,
  hasVideo,
  thumbnailUri,
  isToday,
  onPress,
  style,
}: CalendarCellProps) {
  const dayNumber = date.getDate();
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const pressAnimation = useRef(new Animated.Value(1)).current;
  
  // Pulsing animation for today's date
  useEffect(() => {
    if (isToday) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [isToday, pulseAnimation]);

  // Button press animation (scale 0.97 → 1.05 → 1.0)
  const handlePressIn = () => {
    Animated.timing(pressAnimation, {
      toValue: 0.97,
      duration: 75, // Half of 150ms for press in
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.timing(pressAnimation, {
        toValue: 1.05,
        duration: 37.5, // Quarter of 150ms for bounce
        useNativeDriver: true,
      }),
      Animated.timing(pressAnimation, {
        toValue: 1.0,
        duration: 37.5, // Quarter of 150ms for settle
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    onPress(date);
  };
  
  const cellStyles = [
    styles.base,
    hasVideo && styles.filled,
    isToday && styles.today,
    style,
  ];

  const textStyles = [
    styles.dayText,
    hasVideo && styles.filledText,
    isToday && styles.todayText,
  ];

  const combinedAnimatedStyle = {
    transform: [
      { scale: pressAnimation },
      ...(isToday ? [{ scale: pulseAnimation }] : [])
    ]
  };

  return (
    <Animated.View style={combinedAnimatedStyle}>
      <TouchableOpacity
        style={cellStyles}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {hasVideo && thumbnailUri ? (
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
            <View style={styles.dayNumberOverlay}>
              <Text style={styles.overlayText}>{dayNumber}</Text>
            </View>
          </View>
        ) : (
          <Text style={textStyles}>{dayNumber}</Text>
        )}
        
        {isToday && !hasVideo && (
          <View style={styles.todayIndicator} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    borderRadius: BorderRadius.md, // 12px rounded corners
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filled: {
    backgroundColor: Colors.white,
    borderColor: Colors.sage, // Sage borders for filled days
    borderWidth: 2,
  },
  today: {
    borderColor: Colors.lavender, // Lavender border for today
    borderWidth: 2,
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.sm, // 8px nested radius (12px - 4px = 8px)
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.sm, // 8px nested radius for video previews
  },
  dayNumberOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.sage,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  overlayText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  dayText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filledText: {
    color: Colors.sage,
    fontWeight: '600',
  },
  todayText: {
    color: Colors.lavender,
    fontWeight: '600',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lavender,
  },
});