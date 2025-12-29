/**
 * VideoPlayer Storybook Stories
 * 
 * Stories for the VideoPlayer component showcasing video playback with sage controls.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import { VideoSnippet } from '../types';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-screen video player with sage play controls, progress bar, and smooth animations. Supports auto-play, custom controls, and note overlays.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

// Mock video snippet
const mockSnippet: VideoSnippet = {
  id: 'snippet_1',
  projectId: 'project_1',
  filePath: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  thumbnailPath: 'https://picsum.photos/200/200?random=1',
  duration: 10.5,
  recordedDate: new Date('2024-01-15T14:30:00'),
  calendarDate: '2024-01-15',
  note: 'Beautiful sunset at the beach with friends. The colors were absolutely amazing today!',
  createdAt: new Date('2024-01-15T14:30:00'),
  metadata: {
    mood: 'happy',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
};

const mockSnippetWithoutNote: VideoSnippet = {
  ...mockSnippet,
  id: 'snippet_2',
  note: undefined,
  calendarDate: '2024-01-16',
};

export const Default: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default video player with auto-play enabled, showing sage play controls and note overlay.',
      },
    },
  },
};

export const WithoutNote: Story = {
  args: {
    snippet: mockSnippetWithoutNote,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player without a note, showing clean interface with just the date title.',
      },
    },
  },
};

export const PausedState: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: false,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player in paused state, showing the play button and controls overlay.',
      },
    },
  },
};

export const MinimalControls: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player with minimal controls hidden, showing clean video-only interface.',
      },
    },
  },
};

export const WithVolumeControl: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player with volume control slider and mute functionality.',
      },
    },
  },
};

export const WithNoteOverlay: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: true,
    showNoteOverlay: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player with note overlay displayed during playback.',
      },
    },
  },
};

export const TimelineSequence: Story = {
  args: {
    snippet: mockSnippet,
    visible: true,
    onClose: () => console.log('Video player closed'),
    autoPlay: true,
    showControls: true,
    autoPlayNext: true,
    hasNextVideo: true,
    hasPreviousVideo: true,
    onNextVideo: () => console.log('Next video requested'),
    onPreviousVideo: () => console.log('Previous video requested'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Video player with timeline sequence navigation and auto-play next functionality.',
      },
    },
  },
};