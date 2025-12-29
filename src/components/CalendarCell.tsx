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
    width: 36,
    height: 36,
    borderRadius: 18, // Perfect circle
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: '#FFE4E1', // Light pink background for dates with videos
  },
  today: {
    backgroundColor: Colors.black, // Black circular background for today
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 18, // Perfect circle
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 18, // Perfect circle for video previews
  },
  dayNumberOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  overlayText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  dayText: {
    ...Typography.bodySmall,
    color: Colors.black, // Black text for regular dates
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  filledText: {
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  todayText: {
    color: Colors.white, // White text on black background for today
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
});