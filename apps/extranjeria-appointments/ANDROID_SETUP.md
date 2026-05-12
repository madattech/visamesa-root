# Android Setup Guide

Since iOS requires full Xcode installation (13GB+), let's test on Android instead!

## Prerequisites

1. **Install Android Studio**: https://developer.android.com/studio
2. **Install Java JDK**: Android Studio will prompt you

## Setup Steps

### 1. Install Android Studio

```bash
# Download from: https://developer.android.com/studio
# Or use Homebrew:
brew install --cask android-studio
```

### 2. Configure Android SDK

Open Android Studio and:
1. Go to **Settings/Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
2. Install:
   - Android 13 (API 33) or Android 14 (API 34)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Tools

### 3. Set Environment Variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload:
```bash
source ~/.zshrc
```

### 4. Create an Android Virtual Device (AVD)

In Android Studio:
1. Click **Device Manager** (phone icon on right sidebar)
2. Click **Create Device**
3. Select a device (e.g., Pixel 6)
4. Select system image (e.g., Android 13 - API 33)
5. Click **Finish**

### 5. Start the Emulator

Either:
- **From Android Studio**: Device Manager → Click ▶️ on your AVD
- **From Command Line**: `emulator -avd YOUR_AVD_NAME`

### 6. Run the App

```bash
cd /Users/pejmanchegoonian/Apps/visamesa/visamesa_automation/apps/extranjeria-appointments

# Make sure backend is running
# cd visamesa_be && npm run dev

# Run on Android
npm run android
```

The app will:
1. Build the Android app
2. Install it on the emulator
3. Launch automatically

## Backend URL Configuration

The app is already configured for Android emulator:

`src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://10.0.2.2:3000';
// 10.0.2.2 is the special Android emulator address for localhost
```

## Verify Setup

Check if everything is installed:

```bash
# Check Java
java -version

# Check Android SDK
echo $ANDROID_HOME

# List available emulators
emulator -list-avds

# Check if adb works
adb devices
```

## Troubleshooting

### "ANDROID_HOME not set"

Add to `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### "Unable to load script"

```bash
npm start -- --reset-cache
```

### "Could not connect to development server"

1. Check backend is running: `curl http://localhost:3000/health`
2. In emulator, open app and shake device (Cmd+M)
3. Go to Settings → Change Bundle Location → `localhost:8081`

### Build errors

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Testing the App

Once running:

1. **Login Screen** should appear
2. **Login** with `test@visamesa.com`
3. **See Cases** from backend
4. **Tap a case** → Automation Screen
5. **Start automation** → See placeholder message

## Alternative: Use a Physical Android Device

If you have an Android phone:

1. Enable **Developer Options** on phone
2. Enable **USB Debugging**
3. Connect phone via USB
4. Run `adb devices` (should see your device)
5. Update `src/config/api.ts`:
   ```typescript
   export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000';
   ```
6. Run `npm run android`

Find your IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example: 192.168.1.100
```

## Summary

Android is simpler to set up than iOS for testing. Once the app works on Android, you know it will work on iOS too (React Native is cross-platform).

If you later want iOS:
1. Install full Xcode from App Store (13GB)
2. Run `sudo xcode-select --switch /Applications/Xcode.app`
3. Run `cd ios && pod install && cd ..`
4. Run `npm run ios`
