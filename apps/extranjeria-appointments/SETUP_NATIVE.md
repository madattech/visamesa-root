# Setting Up iOS and Android Native Code

The React Native project structure is ready, but you need to generate the native iOS and Android folders.

## Option 1: Use React Native CLI (Recommended)

This will generate the proper iOS and Android folders with all necessary configurations:

```bash
cd /Users/pejmanchegoonian/Apps/visamesa/visamesa_automation

# Generate native code
npx @react-native-community/cli@latest init VisaMesaAutomation --skip-install --directory .

# When prompted, choose to merge package.json (keep your existing one)
```

After generation:

```bash
# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Option 2: Copy from Existing Project

If you have another React Native project, you can copy the `ios/` and `android/` folders:

```bash
# Copy ios folder
cp -r /path/to/existing/rn/project/ios ./ios

# Copy android folder
cp -r /path/to/existing/rn/project/android ./android

# Update app name in ios/VisaMesaAutomation/Info.plist
# Update app name in android/app/src/main/res/values/strings.xml
```

## Option 3: Manual Creation (Advanced)

If neither option works, I can help create the native folders manually with minimal configuration.

## After Native Setup

1. Update `src/config/api.ts` with correct backend URL
2. Test login
3. Verify case fetching
4. Test WebView automation flow

## Troubleshooting

If you encounter issues:
1. Make sure Xcode Command Line Tools are installed: `xcode-select --install`
2. Make sure Android Studio is installed with SDK
3. Check React Native environment: `npx react-native doctor`
4. Clear caches: `npm start -- --reset-cache`

Let me know which option you choose and if you need help!
