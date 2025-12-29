# Mine - Privacy-First Video Journaling App

## Overview

**Mine** is a privacy-first video journaling application that allows users to capture daily 1-2 second video snippets and compile them into cinematic timelines. Built as a free, local-first alternative to expensive subscription-based apps like 1 Second Everyday (1SE).

## Project Vision

### Tagline
*Privacy-First Video Journaling App*

### Mission Statement
To provide a completely free, privacy-focused video journaling experience where users maintain full control over their data without relying on cloud services or subscriptions.

## Core Philosophy

### Local-First Architecture
- **100% Local Storage**: All videos and data stored on device
- **Zero Backend Dependency**: No servers, no accounts, no cloud storage
- **Complete Privacy**: Your memories stay yours
- **Full Data Ownership**: Export and control your content

### User-Centric Design
- **Completely Free**: No subscriptions, no premium features, no ads
- **Simple & Fast**: Capture moments in seconds, not minutes
- **Privacy by Design**: No tracking, no analytics, no data collection

## Target Audience

- **Privacy-conscious individuals** who want control over their personal data
- **Parents** documenting their children's growth
- **Travelers** creating visual travel diaries
- **Daily journalers** seeking a visual alternative to text-based journaling
- **Anyone** frustrated with expensive subscription apps and privacy concerns

## Market Position

### The Problem We Solve
Existing video journaling apps like 1 Second Everyday charge $30-40/year for basic features and force users to store personal memories in the cloud, raising significant privacy concerns. Users want local-first alternatives with full control over their data.

### Our Differentiation
1. **Completely Free**: No subscriptions ever
2. **100% Local Storage**: Privacy-first approach
3. **Simpler, Faster UI**: Streamlined experience
4. **Open Source Potential**: Community-driven development

### Competitive Analysis

| Feature | Mine | 1 Second Everyday | DayOne |
|---------|------|-------------------|---------|
| **Pricing** | Free Forever | $40/year | $35/year |
| **Data Storage** | 100% Local | Forced Cloud | Cloud-dependent |
| **Privacy** | Complete | Limited | Limited |
| **Offline First** | Yes | Partial | No |
| **Account Required** | No | Yes | Yes |

## Technical Architecture

### Platform
- **Framework**: React Native 0.73+ with TypeScript
- **Platforms**: iOS & Android
- **Architecture**: Local-First Mobile Architecture

### Core Technology Stack
- **UI**: React Native Paper + Custom Components
- **Navigation**: React Navigation v6
- **State Management**: Zustand + React Query
- **Database**: SQLite (expo-sqlite)
- **Video Processing**: react-native-vision-camera + FFmpeg
- **File Storage**: Expo File System

### Data Architecture
```
Documents/Mine/
├── {project_id}/
│   ├── videos/
│   │   └── {YYYY-MM-DD}_{snippet_id}.mp4
│   ├── thumbnails/
│   │   └── {snippet_id}.jpg
│   └── compiled/
│       └── {timestamp}_timeline.mp4
```

## Core Features

### MVP Features (Phase 1)

#### 1. Project Management
Create and manage multiple video journal projects with different themes:
- Timeline projects (daily calendar-based)
- Freestyle projects (event-based)
- Project customization (duration, aspect ratio, themes)

#### 2. Video Capture
Quick and intuitive video recording:
- Auto-stop after 1-3 seconds (configurable)
- Visual countdown timer
- Immediate local storage
- Portrait and landscape support

#### 3. Timeline Calendar View
Visual calendar interface showing capture progress:
- Monthly grid with thumbnail previews
- Clear indication of missing days
- Quick navigation between months
- Tap to play or capture for specific dates

#### 4. Video Storage & Organization
Secure local data management:
- SQLite metadata storage
- Organized file system structure
- Automatic thumbnail generation
- Video compression optimization

#### 5. Timeline Compilation
Merge daily snippets into continuous movies:
- Background processing
- Progress indicators
- Mixed aspect ratio handling
- Fast concat-based merging

#### 6. Video Playback
Smooth in-app video experience:
- Individual snippet playback
- Compiled timeline viewing
- Fullscreen mode
- Playback controls

#### 7. Daily Reminders
Gentle nudges to maintain consistency:
- Customizable reminder times
- Motivational messages
- Respect for Do Not Disturb settings
- Background notifications

#### 8. Export & Share
Share your memories without platform lock-in:
- Save to device camera roll
- Native share sheet integration
- No watermarks or branding
- Multiple quality options

#### 9. Project Customization
Tailor the experience to your needs:
- Clip duration settings (1-3 seconds)
- Aspect ratio options
- Background music integration
- Project themes and colors

#### 10. Snippet Notes & Metadata
Add context to your memories:
- Text notes (up to 500 characters)
- Searchable content
- Optional overlay display
- Metadata tracking (location, mood)

### Post-MVP Features (Future Phases)

#### Phase 2: Enhanced Experience
- **Smart Fill**: Auto-suggest videos from camera roll
- **Advanced Editing**: In-app trim, rotate, filters
- **AI Highlights**: Computer vision for best moments

#### Phase 3: Optional Cloud & Social
- **Encrypted Backup**: End-to-end encrypted cloud storage ($2.99/mo)
- **Social Sharing**: Opt-in public timeline sharing
- **Discovery**: Follow friends, trending timelines

## Development Roadmap

### Phase 1: MVP (Months 1-3)
- Core video capture and storage
- Timeline calendar interface
- Basic compilation and export
- Local-first architecture foundation

### Phase 2: Enhancement (Months 4-6)
- Advanced editing features
- Smart Fill from camera roll
- Performance optimizations
- UI/UX refinements

### Phase 3: Expansion (Months 7-12)
- Optional cloud backup (monetization)
- Social features (opt-in)
- AI-powered features
- Platform expansion (web, desktop)

## Privacy & Security

### Data Protection
- **No Data Collection**: Zero telemetry or analytics
- **Local Encryption**: SQLite database encryption
- **Secure Storage**: iOS Keychain / Android Keystore integration
- **No Network Requests**: Completely offline operation

### User Rights
- **Full Data Ownership**: Complete control over all content
- **Easy Export**: Standard formats (MP4, JSON metadata)
- **No Vendor Lock-in**: Open data formats
- **Transparent Operation**: Open source potential

## Business Model

### Sustainability Strategy
1. **Core App**: Free forever (no ads, no tracking)
2. **Optional Cloud Backup**: $2.99/month for encrypted cloud storage
3. **Enterprise Features**: Team/family sharing capabilities
4. **Open Source**: Community contributions and support

### Revenue Projections
- **Year 1**: Focus on user growth and product-market fit
- **Year 2**: Introduce optional cloud backup service
- **Year 3**: Enterprise and family features

## Community & Support

### Open Source Vision
- **Transparent Development**: Public roadmap and issue tracking
- **Community Contributions**: Welcome external developers
- **Educational Resource**: Reference implementation for local-first apps

### Support Channels
- **Documentation**: Comprehensive user guides
- **Community Forum**: User-driven support
- **Direct Support**: Email-based assistance
- **Feature Requests**: Community-driven prioritization

## Getting Started

### For Users
1. Download from App Store / Google Play
2. Create your first project
3. Start capturing daily moments
4. Watch your timeline grow

### For Developers
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npx expo start`
4. Read the contributing guidelines

## Technical Specifications

### System Requirements
- **iOS**: 13.0+ (iPhone 8 and newer)
- **Android**: API 21+ (Android 5.0+)
- **Storage**: Minimum 1GB free space
- **Camera**: Rear-facing camera required

### Performance Targets
- **App Launch**: < 2 seconds cold start
- **Video Capture**: < 1 second to start recording
- **Timeline Compilation**: < 30 seconds for 365 days
- **Battery Impact**: < 5% per day with normal usage

## License & Legal

### Open Source License
- **License**: MIT (planned)
- **Commercial Use**: Permitted
- **Modification**: Encouraged
- **Distribution**: Unrestricted

### Privacy Compliance
- **GDPR**: Compliant by design (no data collection)
- **CCPA**: N/A (no personal data processing)
- **COPPA**: Safe for all ages
- **Regional Laws**: Compliant worldwide

---

*Last Updated: December 29, 2025*
*Version: 1.0.0*