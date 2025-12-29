/**
 * KeyboardAvoidingContainer - Professional keyboard avoidance container
 * 
 * Implements the complete architectural pattern:
 * - Main container with flex: 1
 * - Content area that can scroll
 * - Bottom spacer that pushes content up
 * - Blur background that matches keyboard height
 * - Smooth frame-by-frame animations
 * 
 * "Through wisdom is an house builded; and by understanding it is established" - Proverbs 24:3
 */

import React from 'react';
import { View, ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { KeyboardSpacer } from './KeyboardSpacer';
import { KeyboardBlurBackground } from './KeyboardBlurBackground';

interface KeyboardAvoidingContainerProps {
  /**
   * Content to be rendered inside the container
   */
  children: React.ReactNode;
  
  /**
   * Style for the main container (flex: 1 is applied by default)
   */
  containerStyle?: ViewStyle;
  
  /**
   * Style for the scroll view content
   */
  contentContainerStyle?: ViewStyle;
  
  /**
   * Whether to enable scrolling (default: true)
   */
  scrollEnabled?: boolean;
  
  /**
   * Additional vertical offset for toolbars or bottom navigation
   */
  verticalOffset?: number;
  
  /**
   * Whether to include standard toolbar offset (42px)
   */
  hasToolbar?: boolean;
  
  /**
   * Whether to show blur background behind keyboard (default: true)
   */
  showBlurBackground?: boolean;
  
  /**
   * Blur intensity for background (default: 20)
   */
  blurIntensity?: number;
  
  /**
   * Additional ScrollView props
   */
  scrollViewProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle' | 'scrollEnabled'>;
}

export function KeyboardAvoidingContainer({
  children,
  containerStyle,
  contentContainerStyle,
  scrollEnabled = true,
  verticalOffset = 0,
  hasToolbar = false,
  showBlurBackground = true,
  blurIntensity = 20,
  scrollViewProps = {}
}: KeyboardAvoidingContainerProps) {
  
  const defaultScrollViewProps: ScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    showsVerticalScrollIndicator: false,
    ...scrollViewProps
  };

  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          scrollEnabled={scrollEnabled}
          {...defaultScrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentContainerStyle]}>
          {children}
        </View>
      )}
      
      {/* Blur background that matches keyboard height */}
      {showBlurBackground && (
        <KeyboardBlurBackground 
          verticalOffset={verticalOffset}
          hasToolbar={hasToolbar}
          intensity={blurIntensity}
        />
      )}
      
      {/* The magic happens here - this spacer pushes content up */}
      <KeyboardSpacer 
        verticalOffset={verticalOffset}
        hasToolbar={hasToolbar}
      />
    </View>
  );
}