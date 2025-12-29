/**
 * MineCard Storybook Stories
 * Design system validation and documentation
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MineCard } from './MineCard';
import { Colors, Spacing, Typography } from '../design-system';

const meta: Meta<typeof MineCard> = {
  title: 'Design System/MineCard',
  component: MineCard,
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story: any) => (
      <View style={{ padding: Spacing.lg, backgroundColor: Colors.offWhite }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <View>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary }}>
          Basic Card
        </Text>
        <Text style={{ ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs }}>
          This is a basic card with some content inside.
        </Text>
      </View>
    ),
  },
};

export const Interactive: Story = {
  args: {
    onPress: () => console.log('Card pressed'),
    children: (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ ...Typography.h3, color: Colors.textPrimary }}>
            Interactive Card
          </Text>
          <Text style={{ ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs }}>
            Tap to interact
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    ),
  },
};

export const ProjectCard: Story = {
  args: {
    onPress: () => console.log('Project card pressed'),
    children: (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
          <Text style={{ ...Typography.h3, color: Colors.textPrimary }}>
            My Timeline Project
          </Text>
          <View style={{ 
            backgroundColor: Colors.sage, 
            paddingHorizontal: Spacing.sm, 
            paddingVertical: Spacing.xs, 
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs
          }}>
            <Ionicons name="calendar" size={12} color={Colors.white} />
            <Text style={{ ...Typography.caption, color: Colors.white, fontWeight: '600' }}>
              Timeline
            </Text>
          </View>
        </View>
        
        <Text style={{ ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.md }}>
          Created Dec 29, 2025 • Updated Dec 29, 2025
        </Text>
        
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: Spacing.lg,
          paddingTop: Spacing.md,
          borderTopWidth: 1,
          borderTopColor: Colors.border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <Ionicons name="videocam" size={16} color={Colors.sage} />
            <Text style={{ ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' }}>
              5 videos
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
            <Ionicons name="time" size={16} color={Colors.textSecondary} />
            <Text style={{ ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' }}>
              10s total
            </Text>
          </View>
        </View>
      </View>
    ),
  },
};

export const DesignValidation: Story = {
  render: () => (
    <View style={{ gap: Spacing.lg }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Design System Validation
      </Text>
      
      <MineCard>
        <Text style={{ ...Typography.body, color: Colors.textPrimary, marginBottom: Spacing.sm }}>
          Border Radius Validation
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Card uses 16px border radius (BorderRadius.lg)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ White background color
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Subtle shadow for elevation
        </Text>
      </MineCard>
      
      <MineCard>
        <Text style={{ ...Typography.body, color: Colors.textPrimary, marginBottom: Spacing.sm }}>
          Spacing Validation
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Internal padding: 16px (Spacing.md)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Bottom margin: 24px (Spacing.lg)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Follows 8px grid system
        </Text>
      </MineCard>
    </View>
  ),
};