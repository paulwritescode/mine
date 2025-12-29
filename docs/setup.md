# Mine App - Project Setup

This document outlines the core infrastructure setup for the Mine video journaling app.

## Architecture Overview

Mine follows a local-first, three-tier architecture:

1. **Presentation Layer**: React Native with Expo Router
2. **Business Logic Layer**: Service classes for data management
3. **Data Layer**: SQLite database + file system storage

## Core Infrastructure

### Design System
- **Location**: `src/design-system/`
- **Purpose**: Consistent UI tokens, theme provider, and reusable components
- **Key Files**:
  - `tokens.ts`: Core design tokens (colors, spacing, typography)
  - `theme.ts`: Theme configuration and provider
  - `ThemeProvider.tsx`: React context for theme access

### Navigation
- **Framework**: Expo Router with React Navigation
- **Structure**: Tab-based navigation with stack navigators
- **Files**: `app/(tabs)/_layout.tsx`, `app/_layout.tsx`

### Database
- **Technology**: SQLite via expo-sqlite
- **Service**: `src/services/DatabaseService.ts`
- **Schema**: Projects, snippets, and settings tables
- **Features**: Automatic migrations, indexes for performance

### File System
- **Service**: `src/utils/fileSystem.ts`
- **Structure**: Organized project directories with videos, thumbnails, compiled files
- **Location**: Device Documents directory for user data ownership

### State Management
- **Technology**: Zustand
- **Stores**: App-level settings and project-specific state
- **Files**: `src/store/useAppStore.ts`, `src/store/useProjectStore.ts`

## Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
npm install
npx expo start
```

### Available Scripts
- `npm start`: Start Expo development server
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm run web`: Run in web browser
- `npm test`: Run test suite
- `npm run lint`: Run ESLint

## Design System Usage

```typescript
import { useDesignTokens, MineButton } from '@/src/design-system';

function MyScreen() {
  const tokens = useDesignTokens();
  
  return (
    <View style={{ padding: tokens.spacing.md }}>
      <MineButton variant="primary" onPress={handleAction}>
        Create Project
      </MineButton>
    </View>
  );
}
```

## Next Steps

The core infrastructure is now ready for feature implementation:

1. **Video Capture**: Camera integration and video processing
2. **Project Management**: CRUD operations for projects and snippets
3. **Timeline Compilation**: Video merging and export functionality
4. **UI Components**: Calendar grid, video player, project cards

Each feature will build upon this foundation while maintaining consistency through the design system.