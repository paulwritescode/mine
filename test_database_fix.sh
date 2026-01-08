#!/bin/bash

echo "🔧 Testing Database Fix for Release Build"
echo "========================================"

# Clean build
echo "1. Cleaning previous builds..."
flutter clean
flutter pub get

# Build release APK
echo "2. Building release APK..."
flutter build apk --release

if [ $? -eq 0 ]; then
    echo "✅ Release APK built successfully"
    
    # Install and test (if device connected)
    if adb devices | grep -q "device$"; then
        echo "3. Installing on connected device..."
        flutter install --release
        
        echo "4. Starting logcat to monitor database initialization..."
        echo "   Look for 'Database initialized successfully' message"
        echo "   Press Ctrl+C to stop monitoring"
        adb logcat -s flutter
    else
        echo "⚠️  No device connected. Please connect your Android device and run:"
        echo "   flutter install --release"
        echo "   adb logcat -s flutter"
    fi
else
    echo "❌ Build failed. Check the error messages above."
fi