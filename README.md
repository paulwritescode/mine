# Mine - Privacy-First Video Journaling App 📱

> *A local-first mobile application for capturing daily 1-2 second video snippets and compiling them into cinematic timelines. Built as a free, privacy-focused alternative to 1 Second Everyday (1SE).*

[![React Native](https://img.shields.io/badge/React%20Native-0.73+-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2050+-black.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 What is Mine?

Mine is a **100% free, 100% private** video journaling app that lets you:
- Capture 1-2 second daily video moments
- Build beautiful timeline compilations
- Keep all your data locally on your device
- Never worry about subscriptions or privacy concerns

### Why Mine?
- ✅ **Completely Free** - No subscriptions, no premium features, no ads
- 🔒 **Privacy-First** - All data stored locally, no cloud required
- 📱 **Local-First** - Works completely offline
- 🎬 **Cinematic** - Compile your daily moments into movies
- 🚀 **Fast & Simple** - Capture moments in seconds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- iOS Simulator (macOS) or Android Emulator
- Expo CLI: `npm install -g @expo/cli`

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mine-app
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on your device**
   - **iOS**: Press `i` to open iOS Simulator
   - **Android**: Press `a` to open Android Emulator
   - **Physical Device**: Scan QR code with Expo Go app

## 📱 Core Features

### 🎥 Video Capture
- **Quick Recording**: Auto-stop after 1-3 seconds (configurable)
- **Visual Feedback**: Countdown timer and capture confirmation
- **Quality Control**: Automatic compression and thumbnail generation

### 📅 Timeline Calendar
- **Visual Progress**: Monthly calendar showing captured vs missing days
- **Quick Navigation**: Tap empty days to capture, filled days to view
- **Progress Tracking**: See your consistency at a glance

### 🎬 Timeline Compilation
- **Automatic Merging**: Compile all daily videos into one continuous movie
- **Background Processing**: Non-blocking compilation with progress indicators
- **Smart Handling**: Mixed aspect ratios automatically normalized

### 📤 Export & Share
- **Camera Roll**: Save compiled timelines to your photo library
- **Native Sharing**: Use iOS/Android share sheet for social media
- **No Watermarks**: Your content, completely unbranded

### 🔔 Daily Reminders
- **Gentle Nudges**: Customizable daily reminders to capture moments
- **Smart Timing**: Respects Do Not Disturb and user preferences
- **Motivational**: Encouraging messages to maintain consistency

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React Native 0.73+ with TypeScript
- **Navigation**: React Navigation v6 (Bottom Tabs + Stack)
- **State Management**: Zustand + React Query
- **Database**: SQLite (expo-sqlite)
- **Video Processing**: react-native-vision-camera + FFmpeg
- **UI Components**: React Native Paper + Custom Components

### Local-First Architecture
```
📱 Device Storage
├── 🗄️ SQLite Database (metadata)
├── 📁 Documents/Mine/
│   ├── {project_id}/
│   │   ├── videos/ (MP4 files)
│   │   ├── thumbnails/ (JPEG files)
│   │   └── compiled/ (timeline videos)
```

### Key Design Principles
- **Privacy by Design**: No network requests, no data collection
- **Offline-First**: Full functionality without internet
- **Performance**: Optimized for mobile devices
- **Simplicity**: Minimal UI, maximum functionality

## 📊 Project Structure

```
mine-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Projects list
│   │   ├── capture.tsx    # Camera screen
│   │   └── settings.tsx   # App settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── video/            # Video-related components
│   └── timeline/         # Timeline-specific components
├── services/             # Business logic layer
│   ├── VideoService.ts   # Video capture & processing
│   ├── ProjectService.ts # Project management
│   └── DatabaseService.ts # SQLite operations
├── hooks/                # Custom React hooks
├── constants/            # App constants & themes
├── assets/              # Images, icons, fonts
└── docs/                # Documentation
```

## 🎨 Design System

### Color Palette
- **Primary (70%)**: White (#FFFFFF, #FAFAFA) - Clean, minimalist foundation
- **Secondary (30%)**: Sage Green (#9CAF88) - Calm, growth-focused actions
- **Accent (10%)**: Lavender (#B8A4D5) - Gentle highlights and celebrations

### Design Philosophy
- **Rounded Corners**: Inviting, friendly interface (4px-32px scale)
- **Generous Whitespace**: Breathing room for content
- **Visual Hierarchy**: Clear typography scale (SF Pro/Roboto)
- **Accessibility**: WCAG 2.1 AA compliant

## 🔒 Privacy & Security

### Data Protection
- **Zero Data Collection**: No analytics, no telemetry, no tracking
- **Local Encryption**: SQLite database encryption
- **Secure Storage**: iOS Keychain / Android Keystore integration
- **No Network Requests**: Completely offline operation

### User Rights
- **Full Data Ownership**: Complete control over all content
- **Easy Export**: Standard formats (MP4, JSON metadata)
- **No Vendor Lock-in**: Open data formats
- **Transparent Operation**: Open source roadmap

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   npm start
   # Make your changes
   npm test
   git commit -m "feat: add your feature"
   ```

2. **Testing**
   ```bash
   # Run unit tests
   npm test
   
   # Run on device
   npx expo start --device
   ```

3. **Building**
   ```bash
   # Create development build
   npx expo run:ios
   npx expo run:android
   
   # Create production build
   eas build --platform all
   ```

## 📋 Roadmap

### Phase 1: MVP (Current)
- [x] Project management system
- [x] Video capture with auto-stop
- [x] Timeline calendar interface
- [x] Local SQLite storage
- [ ] Timeline compilation
- [ ] Export functionality
- [ ] Daily reminders

### Phase 2: Enhancement
- [ ] Smart Fill from camera roll
- [ ] Advanced video editing (trim, rotate, filters)
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Phase 3: Expansion
- [ ] Optional encrypted cloud backup ($2.99/mo)
- [ ] Social sharing features (opt-in)
- [ ] AI-powered highlights
- [ ] Web companion app

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/mine-app.git
cd mine-app

# Install dependencies
npm install

# Start development
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing React Native framework
- **Local-First Community** - For inspiring privacy-focused development
- **1 Second Everyday** - For proving the market need (we're just doing it better!)

## 📞 Support

- **Documentation**: [Full documentation](docs/about.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/mine-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/mine-app/discussions)
- **Email**: support@mine-app.com

---

**Built with ❤️ for privacy-conscious creators**

*Mine - Your memories, your device, your control.*