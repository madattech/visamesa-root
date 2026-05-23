#!/bin/bash
# Workaround for React Native CLI scheme detection bug
# This script builds and runs the iOS app using xcodebuild directly

set -e

cd "$(dirname "$0")/ios"

echo "Building VisaMesa for iOS Simulator..."

xcodebuild \
  -workspace VisaMesa.xcworkspace \
  -scheme VisaMesa \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  build

echo "Installing app on simulator..."

# Get the app path
APP_PATH="$(find ~/Library/Developer/Xcode/DerivedData -name "VisaMesa.app" -type d | head -n 1)"

if [ -z "$APP_PATH" ]; then
  echo "Error: Could not find VisaMesa.app"
  exit 1
fi

# Install on simulator
xcrun simctl install booted "$APP_PATH"

# Launch the app
xcrun simctl launch booted com.visamesa

echo "✅ iOS app launched successfully"
