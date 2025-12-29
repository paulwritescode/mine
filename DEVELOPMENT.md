# Mine - Development Setup

## Overview

Mine is a video journaling app built with React Native and Expo. Since it uses `react-native-vision-camera` for camera functionality, it requires a development build and cannot run in Expo Go.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- EAS CLI: `npm install -g @expo/cli eas-cli`
- iOS Simulator (for iOS development) or Android emulator/device (for Android development)

## Development Build Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Development Build

Since the app uses native camera functionality, you need to create a development build:

#### For iOS Simulator:
```bash
eas build --profile development --platform ios --local
```

#### For Android:
```bash
eas build --profile development --platform android --local
```

#### Or build in the cloud:
```bash
eas build --profile development --platform all
```

### 3. Install Development Build

After the build completes:

- **iOS**: Install the `.app` file in your iOS Simulator
- **Android**: Install the `.apk` file on your Android device/emulator

### 4. Start Development Server

```bash
npx expo start --dev-client
```

Then scan the QR code with your development build app.

## Features Implemented

✅ **Project Creation**: Create timeline or freestyle video projects
✅ **Camera Integration**: Record 1-3 second video clips with react-native-vision-camera
✅ **Project Management**: View, organize, and manage video projects
✅ **Calendar View**: Timeline projects show videos organized by date
✅ **Design System**: Complete UI component library with sage/lavender color scheme
✅ **Database**: Local SQLite storage with expo-sqlite
✅ **Navigation**: Expo Router file-based navigation

## Project Structure

```
app/                    # Expo Router screens
├── (tabs)/            # Tab navigation screens
│   ├── index.tsx      # Projects list
│   ├── explore.tsx    # Camera access
│   └── settings.tsx   # App settings
├── create-project.tsx # Project creation
├── project/[id].tsx   # Project detail view
├── camera.tsx         # Camera screen
└── post-capture.tsx   # Video processing

src/                   # Source code
├── components/        # Reusable UI components
├── design-system/     # Design tokens and theme
├── services/          # Business logic and data
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

## Key Components

- **MineButton**: Primary button component with sage color scheme
- **MineCard**: Card component with rounded corners and shadows
- **MineInput**: Text input with focus states and validation
- **CalendarGrid**: Monthly calendar with video thumbnails
- **VideoPlayer**: Video playback with controls

## Database Schema

- **projects**: Video project metadata
- **snippets**: Individual video clips with notes
- **settings**: App configuration

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run Storybook (component library)
npm run storybook:dev
```

## Troubleshooting

### Camera Not Working
- Ensure you're using a development build, not Expo Go
- Check camera permissions in device settings
- Verify react-native-vision-camera is properly configured

### Build Issues
- Clear cache: `npx expo install --fix`
- Clean build: `eas build --profile development --platform [ios|android] --clear-cache`

### Database Issues
- Check if database initialization completed in app logs
- Verify SQLite permissions on device

## Next Steps

The app is ready for further development of features like:
- Video compilation and export
- Advanced editing features
- Cloud sync (optional)
- Push notifications
- Advanced search and filtering