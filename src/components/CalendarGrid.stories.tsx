/**
 * CalendarGrid Storybook Stories
 * 
 * Stories for the CalendarGrid component showcasing different states and interactions.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { CalendarGrid } from './CalendarGrid';
import { VideoSnippet } from '../types';

const meta: Meta<typeof CalendarGrid> = {
  title: 'Components/CalendarGrid',
  component: CalendarGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Monthly calendar layout with design system styling. Features sage borders for filled days, lavender pulsing animation for today, and smooth month navigation transitions.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CalendarGrid>;

// Mock snippets for different scenarios
const mockSnippets: VideoSnippet[] = [
  {
    id: 'snippet_1',
    projectId: 'project_1',
    filePath: '/path/to/video1.mp4',
    thumbnailPath: 'https://picsum.photos/100/100?random=1',
    duration: 2.5,
    recordedDate: new Date('2024-01-15'),
    calendarDate: '2024-01-15',
    createdAt: new Date('2024-01-15'),
    metadata: {},
  },
  {
    id: 'snippet_2',
    projectId: 'project_1',
    filePath: '/path/to/video2.mp4',
    thumbnailPath: 'https://picsum.photos/100/100?random=2',
    duration: 1.8,
    recordedDate: new Date('2024-01-18'),
    calendarDate: '2024-01-18',
    createdAt: new Date('2024-01-18'),
    metadata: {},
  },
  {
    id: 'snippet_3',
    projectId: 'project_1',
    filePath: '/path/to/video3.mp4',
    thumbnailPath: 'https://picsum.photos/100/100?random=3',
    duration: 3.0,
    recordedDate: new Date('2024-01-22'),
    calendarDate: '2024-01-22',
    createdAt: new Date('2024-01-22'),
    metadata: {},
  },
  {
    id: 'snippet_4',
    projectId: 'project_1',
    filePath: '/path/to/video4.mp4',
    thumbnailPath: 'https://picsum.photos/100/100?random=4',
    duration: 2.2,
    recordedDate: new Date('2024-01-25'),
    calendarDate: '2024-01-25',
    createdAt: new Date('2024-01-25'),
    metadata: {},
  },
];

const emptySnippets: VideoSnippet[] = [];

const currentDate = new Date('2024-01-15'); // January 2024

export const Default: Story = {
  args: {
    snippets: mockSnippets,
    currentDate,
    onDateChange: (date: Date) => console.log('Date changed:', date),
    onCellPress: (date: Date) => console.log('Cell pressed:', date),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default calendar grid with some filled days showing video thumbnails. Today\'s date has a pulsing lavender border.',
      },
    },
  },
};

export const EmptyCalendar: Story = {
  args: {
    snippets: emptySnippets,
    currentDate,
    onDateChange: (date: Date) => console.log('Date changed:', date),
    onCellPress: (date: Date) => console.log('Cell pressed:', date),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty calendar with no video snippets. All days show in neutral gray with today highlighted in lavender.',
      },
    },
  },
};

export const FullMonth: Story = {
  args: {
    snippets: Array.from({ length: 31 }, (_, i) => ({
      id: `snippet_${i + 1}`,
      projectId: 'project_1',
      filePath: `/path/to/video${i + 1}.mp4`,
      thumbnailPath: `https://picsum.photos/100/100?random=${i + 1}`,
      duration: 2.0 + Math.random(),
      recordedDate: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
      calendarDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
      createdAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
      metadata: {},
    })),
    currentDate,
    onDateChange: (date: Date) => console.log('Date changed:', date),
    onCellPress: (date: Date) => console.log('Cell pressed:', date),
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with every day filled, showing 100% progress. Demonstrates how the grid looks when completely filled.',
      },
    },
  },
};

export const PartialProgress: Story = {
  args: {
    snippets: Array.from({ length: 15 }, (_, i) => ({
      id: `snippet_${i + 1}`,
      projectId: 'project_1',
      filePath: `/path/to/video${i + 1}.mp4`,
      thumbnailPath: `https://picsum.photos/100/100?random=${i + 1}`,
      duration: 2.0 + Math.random(),
      recordedDate: new Date(`2024-01-${String((i * 2) + 1).padStart(2, '0')}`),
      calendarDate: `2024-01-${String((i * 2) + 1).padStart(2, '0')}`,
      createdAt: new Date(`2024-01-${String((i * 2) + 1).padStart(2, '0')}`),
      metadata: {},
    })),
    currentDate,
    onDateChange: (date: Date) => console.log('Date changed:', date),
    onCellPress: (date: Date) => console.log('Cell pressed:', date),
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with partial progress showing approximately 50% completion. Progress bar reflects the completion percentage.',
      },
    },
  },
};

export const DifferentMonth: Story = {
  args: {
    snippets: [
      {
        id: 'snippet_1',
        projectId: 'project_1',
        filePath: '/path/to/video1.mp4',
        thumbnailPath: 'https://picsum.photos/100/100?random=10',
        duration: 2.5,
        recordedDate: new Date('2024-03-10'),
        calendarDate: '2024-03-10',
        createdAt: new Date('2024-03-10'),
        metadata: {},
      },
      {
        id: 'snippet_2',
        projectId: 'project_1',
        filePath: '/path/to/video2.mp4',
        thumbnailPath: 'https://picsum.photos/100/100?random=11',
        duration: 1.8,
        recordedDate: new Date('2024-03-15'),
        calendarDate: '2024-03-15',
        createdAt: new Date('2024-03-15'),
        metadata: {},
      },
    ],
    currentDate: new Date('2024-03-01'), // March 2024
    onDateChange: (date: Date) => console.log('Date changed:', date),
    onCellPress: (date: Date) => console.log('Cell pressed:', date),
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar showing March 2024 with a few video snippets. Demonstrates how the calendar looks in different months.',
      },
    },
  },
};

// Interactive story for testing navigation
export const Interactive: Story = {
  args: {
    snippets: mockSnippets,
    currentDate,
    onDateChange: (date: Date) => {
      console.log('Date changed to:', date.toLocaleDateString());
    },
    onCellPress: (date: Date) => {
      const hasVideo = mockSnippets.some(s => s.calendarDate === date.toISOString().split('T')[0]);
      if (hasVideo) {
        console.log('Playing video for:', date.toLocaleDateString());
      } else {
        console.log('Opening camera for:', date.toLocaleDateString());
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive calendar for testing navigation and cell interactions. Check the console for interaction logs.',
      },
    },
  },
};