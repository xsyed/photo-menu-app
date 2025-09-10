# Photo Menu - React Native Camera Gallery App

A lightweight Android app built with Expo and React Native that allows users to capture photos with the device camera and view them locally in a beautiful gallery interface.

## Features

- 📷 **Camera Integration**: Capture photos using device camera with Expo Camera APIs
- 🖼️ **Local Gallery**: View captured photos in a responsive two-column grid
- 📝 **List View**: Toggle between grid and list view with photo metadata
- 🔍 **Full-screen Viewer**: View photos full-screen with pinch-to-zoom support
- 💾 **Local Storage**: Photos saved locally with no cloud sync required
- 🍔 **Burger App Icon**: Custom burger-themed app icon for Android
- 🔒 **Privacy First**: No network permissions, all data stays on device

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd menu/app-src
```

2. Install dependencies:
```bash
npm install
```

3. For web development, install additional dependencies:
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

## Running the App

### Development

Start the development server:
```bash
npx expo start
# or
npm start
```

### Web Version
```bash
npx expo start --web
# or
npm run web
```

### Android
```bash
npx expo start --android
# or
npm run android
```

### iOS (for testing)
```bash
npx expo start --ios
# or
npm run ios
```

## Project Structure

```
app-src/
├── components/
│   ├── CameraScreen.tsx      # Camera capture interface
│   ├── CameraDropdown.tsx    # Camera options dropdown menu
│   ├── PhotoGrid.tsx         # Grid/list view gallery
│   └── PhotoViewer.tsx       # Full-screen photo viewer
├── services/
│   └── PhotoStorageService.ts # Local storage management
├── types/
│   └── index.ts              # TypeScript type definitions
├── assets/                   # App icons and images
├── App.tsx                   # Main application component
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
└── package.json              # Dependencies and scripts
```

## Technology Stack

- **Framework**: Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Camera**: expo-camera
- **Image Selection**: expo-image-picker
- **Storage**: expo-file-system + AsyncStorage
- **Image Processing**: expo-image-manipulator
- **Gestures**: react-native-gesture-handler + react-native-reanimated

## Key Components

### CameraScreen
- Camera capture with front/back toggle
- Image optimization and compression
- Save/cancel functionality
- Permission handling

### CameraDropdown
- Camera action selection menu
- Take photo or select from gallery options
- Clean dropdown interface
- Action delegation to parent components

### PhotoGrid
- Responsive two-column grid layout
- List view with timestamps
- Empty state with friendly UI
- Smooth view mode transitions

### PhotoViewer
- Full-screen photo display
- Pinch-to-zoom gestures
- Double-tap to zoom
- Back navigation

### PhotoStorageService
- Local file management
- Metadata persistence
- Storage validation
- Photo cleanup

## Data Model

Photos are stored with the following structure:
```typescript
interface Photo {
  id: string;           // Unique identifier
  fileName: string;     // File name with timestamp
  uri: string;          // Local file URI
  timestamp: number;    // Creation timestamp
  width: number;        // Image width
  height: number;       // Image height
}
```

## Permissions

The app requires the following permissions:
- **CAMERA**: For capturing photos
- **RECORD_AUDIO**: For camera functionality (Android requirement)
- **WRITE_EXTERNAL_STORAGE**: For saving photos (Android)
- **Photo Library Access**: For selecting images from gallery (iOS)

## Build for Production

### EAS Build Setup

1. Install EAS CLI globally:
```bash
npm install -g @expo/eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Build APK for production:
```bash
eas build --platform android --profile production
```

4. Or use the npm script:
```bash
npm run eas-build
```

### Local Development Build
```bash
npx expo run:android
```

## Testing

- Test on Android API levels 26, 29, 33
- Verify camera permissions flow
- Test storage failure scenarios
- Performance testing with 100+ photos

## Configuration Files

### EAS Build (`eas.json`)
- Production and preview build profiles
- Android APK build configuration
- Can be extended for iOS builds

### Expo Config (`app.json`)
- App metadata and configuration
- Platform-specific settings
- Plugin configurations for camera and image picker
- Permissions and capabilities

## Development Scripts

Available npm scripts:
```bash
npm start          # Start Expo development server
npm run android    # Start with Android emulator/device
npm run ios        # Start with iOS simulator/device  
npm run web        # Start web development server
npm run eas-build  # Build production APK with EAS
```

## Known Issues

- Some package versions may need updating for best compatibility
- Web version has limited camera functionality (browser limitations)
- Gesture handling may vary on different devices
- EAS Build requires Expo account and project setup

## Troubleshooting

### Camera Permission Issues
- Ensure camera permissions are granted in device settings
- Check if camera hardware is available on device/emulator

### Build Issues
- Run `npx expo doctor` to check for common issues
- Clear Metro cache: `npx expo start --clear`
- Reset dependencies: `rm -rf node_modules && npm install`

## License

This project is built according to the Product Requirements Document (PRD) specifications for a photo capture and local gallery application.
