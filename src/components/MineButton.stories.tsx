/**
 * MineButton Storybook Stories
 * Design system validation and documentation
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MineButton } from './MineButton';
import { Colors, Spacing } from '../design-system';

const meta: Meta<typeof MineButton> = {
  title: 'Design System/MineButton',
  component: MineButton,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'fab'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
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

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
    onPress: () => console.log('Primary button pressed'),
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
    onPress: () => console.log('Secondary button pressed'),
  },
};

export const FAB: Story = {
  args: {
    variant: 'fab',
    children: <Ionicons name="add" size={24} color={Colors.white} />,
    onPress: () => console.log('FAB pressed'),
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: Spacing.md }}>
      <MineButton variant="primary" size="small" onPress={() => {}}>
        Small Button
      </MineButton>
      <MineButton variant="primary" size="medium" onPress={() => {}}>
        Medium Button
      </MineButton>
      <MineButton variant="primary" size="large" onPress={() => {}}>
        Large Button
      </MineButton>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ gap: Spacing.md }}>
      <MineButton variant="primary" onPress={() => {}}>
        Normal State
      </MineButton>
      <MineButton variant="primary" disabled onPress={() => {}}>
        Disabled State
      </MineButton>
      <MineButton variant="primary" loading onPress={() => {}}>
        Loading State
      </MineButton>
    </View>
  ),
};

export const ColorValidation: Story = {
  render: () => (
    <View style={{ gap: Spacing.md }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Color Palette Validation
      </Text>
      <Text style={{ color: Colors.textSecondary, marginBottom: Spacing.md }}>
        All buttons should use only approved sage green colors
      </Text>
      
      <MineButton variant="primary" onPress={() => {}}>
        Sage Primary ({Colors.sage})
      </MineButton>
      <MineButton variant="secondary" onPress={() => {}}>
        Sage Secondary Border
      </MineButton>
      
      <View style={{ marginTop: Spacing.lg }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          ✓ Primary uses sage background: {Colors.sage}
        </Text>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          ✓ Secondary uses sage border: {Colors.sage}
        </Text>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          ✓ White text on sage background for contrast
        </Text>
      </View>
    </View>
  ),
};

export const TouchTargets: Story = {
  render: () => (
    <View style={{ gap: Spacing.md }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Touch Target Validation
      </Text>
      <Text style={{ color: Colors.textSecondary, marginBottom: Spacing.md }}>
        All buttons should meet 44x44px minimum touch target
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <MineButton variant="primary" size="small" onPress={() => {}}>
          Small (36px min)
        </MineButton>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          ⚠️ Below 44px minimum
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <MineButton variant="primary" size="medium" onPress={() => {}}>
          Medium (56px)
        </MineButton>
        <Text style={{ color: Colors.success, fontSize: 12 }}>
          ✓ Meets 44px minimum
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <MineButton variant="fab" onPress={() => {}}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </MineButton>
        <Text style={{ color: Colors.success, fontSize: 12 }}>
          ✓ FAB 64px exceeds minimum
        </Text>
      </View>
    </View>
  ),
};