# React Native Setup Guide

This document explains critical setup requirements to avoid common build failures.

## Critical Issues & Solutions

### Issue 1: Metro Bundler Error (FIXED)

**Symptom:** `Cannot read properties of undefined (reading 'handle')`

**Cause:** React Native 0.77.x has compatibility issues with `@react-native-community/cli` version 20.x

**Solution:**

- CLI version is locked to `16.0.2` in package.json
- `.npmrc` file prevents automatic version upgrades
- **DO NOT** run `npm update` on the CLI package

**Prevention:**

```bash
# Always use exact versions when installing
npm install --save-exact

# Never upgrade the CLI without testing
# npm upgrade @react-native-community/cli  # ❌ DON'T DO THIS
```

### Issue 2: iOS Build Hermes Error (FIXED)

**Symptom:** `PhaseScriptExecution [CP-User] [Hermes] Replace Hermes for the right configuration failed`

**Cause:** The `ios/.xcode.env.local` file contained a hardcoded Node.js path from another developer's machine:

```bash
# Bad - from another user's machine
export NODE_BINARY=/Users/AnotherUser/.nvm/versions/node/v25.6.0/bin/node
```

**Solution:**

- Deleted `ios/.xcode.env.local`
- Added it to `.gitignore` to prevent future commits
- Xcode now uses the default `.xcode.env` which dynamically finds Node

**Prevention:**

```bash
# Never commit .xcode.env.local
git rm --cached ios/.xcode.env.local  # Remove from git if already committed

# If you need a local override, use your actual node path
# which node  # Get your path first
echo "export NODE_BINARY=$(which node)" > ios/.xcode.env.local
```

## Setup Checklist for New Developers

1. **Install Node.js** (v18 or higher)

   ```bash
   node --version  # Should be v18+
   ```

2. **Install dependencies**

   ```bash
   npm ci  # Use ci for exact versions from package-lock.json
   ```

3. **Verify iOS setup** (macOS only)

   ```bash
   # Check Xcode is installed
   xcode-select -p

   # Install CocoaPods dependencies
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**

   ```bash
   npm start
   ```

5. **Run the app**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## Environment Files

### `.xcode.env` (versioned ✅)

- Contains default Node.js detection logic
- Safe to commit
- Works across all machines

### `.xcode.env.local` (NOT versioned ❌)

- Machine-specific overrides
- **MUST NOT** be committed to git
- Automatically ignored by `.gitignore`
- Only create if you have special requirements

## Common Errors

### Error: "Command not found: node"

**Solution:** Ensure Node.js is in your PATH

```bash
# If using nvm
nvm use 20

# Verify
which node
node --version
```

### Error: "Pod install fails"

**Solution:** Set UTF-8 encoding

```bash
export LANG=en_US.UTF-8
cd ios && pod install
```

### Error: Metro bundler crashes on start

**Solution:** Clear caches

```bash
npm start -- --reset-cache
```

## Version Lock Rationale

| Package                       | Version  | Why Locked?                          |
| ----------------------------- | -------- | ------------------------------------ |
| `@react-native-community/cli` | 16.0.2   | Version 20.x breaks Metro in RN 0.77 |
| React Native                  | 0.77.3   | Project baseline                     |
| Node.js                       | 20.19.4+ | Recommended for RN 0.77              |

## Updating Dependencies

When updating dependencies:

1. **Check React Native release notes** first
2. **Test in a branch** before merging
3. **Update CLI only when** React Native docs confirm compatibility
4. **Clear all caches** after updates:

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Clear Metro cache
   rm -rf node_modules/.cache

   # Clear iOS build
   cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

   # Clear Android build
   cd android && ./gradlew clean && cd ..
   ```

## Team Collaboration

**For Git commits:**

- Never commit `node_modules/`
- Never commit `ios/Pods/`
- Never commit `ios/.xcode.env.local`
- Never commit `android/local.properties`
- Always commit `package-lock.json`
- Always commit `ios/Podfile.lock`

**For new team members:**

1. Clone repository
2. Run `npm ci` (not `npm install`)
3. Run `cd ios && pod install`
4. Verify Node version matches team standard
5. Do NOT create `.xcode.env.local` unless necessary

## Troubleshooting

If builds fail after pulling changes:

```bash
# 1. Clean everything
rm -rf node_modules package-lock.json
rm -rf ios/Pods ios/Podfile.lock
rm -rf ios/.xcode.env.local  # If it exists

# 2. Reinstall
npm ci
cd ios && export LANG=en_US.UTF-8 && pod install && cd ..

# 3. Try building
npm run ios
```

## Contact

If you encounter issues not covered here, document them in this file for future reference.

---

Last updated: May 23, 2026
