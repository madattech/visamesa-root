#!/bin/bash

# Android Setup Script for React Native
# This script helps configure your Mac for Android development

echo "🤖 Android Development Environment Setup"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Android Studio is installed
echo -e "${BLUE}Checking Android Studio installation...${NC}"
if [ -d "/Applications/Android Studio.app" ]; then
    echo -e "${GREEN}✅ Android Studio is installed${NC}"
else
    echo -e "${RED}❌ Android Studio is not installed${NC}"
    echo ""
    echo -e "${YELLOW}Install Android Studio:${NC}"
    echo "  Option 1: brew install --cask android-studio"
    echo "  Option 2: Download from https://developer.android.com/studio"
    echo ""
    exit 1
fi

# Check for Android SDK
echo ""
echo -e "${BLUE}Checking Android SDK...${NC}"
SDK_PATHS=(
    "$HOME/Library/Android/sdk"
    "$HOME/Android/Sdk"
    "/usr/local/android-sdk"
)

SDK_FOUND=false
ANDROID_HOME=""

for path in "${SDK_PATHS[@]}"; do
    if [ -d "$path" ]; then
        SDK_FOUND=true
        ANDROID_HOME="$path"
        echo -e "${GREEN}✅ Android SDK found at: $path${NC}"
        break
    fi
done

if [ "$SDK_FOUND" = false ]; then
    echo -e "${RED}❌ Android SDK not found${NC}"
    echo ""
    echo -e "${YELLOW}Please open Android Studio and install SDK:${NC}"
    echo "  1. Open Android Studio"
    echo "  2. Click 'More Actions' → 'SDK Manager'"
    echo "  3. Install 'Android SDK Platform 34' (or latest)"
    echo "  4. Install 'Android SDK Build-Tools'"
    echo ""
    exit 1
fi

# Determine shell config file
SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
else
    SHELL_CONFIG="$HOME/.profile"
fi

echo ""
echo -e "${BLUE}Checking environment variables...${NC}"

# Check if ANDROID_HOME is already set
if grep -q "ANDROID_HOME" "$SHELL_CONFIG" 2>/dev/null; then
    echo -e "${GREEN}✅ ANDROID_HOME already configured in $SHELL_CONFIG${NC}"
else
    echo -e "${YELLOW}⚠️  ANDROID_HOME not configured${NC}"
    echo ""
    echo -e "${BLUE}Adding Android environment variables to $SHELL_CONFIG...${NC}"
    
    cat >> "$SHELL_CONFIG" << EOF

# Android Development Environment (added by android-setup.sh)
export ANDROID_HOME=\$HOME/Library/Android/sdk
export PATH=\$PATH:\$ANDROID_HOME/emulator
export PATH=\$PATH:\$ANDROID_HOME/platform-tools
export PATH=\$PATH:\$ANDROID_HOME/tools
export PATH=\$PATH:\$ANDROID_HOME/tools/bin

EOF
    
    echo -e "${GREEN}✅ Environment variables added!${NC}"
    echo ""
    echo -e "${YELLOW}Run this command to apply changes:${NC}"
    echo "  source $SHELL_CONFIG"
fi

# Check Java
echo ""
echo -e "${BLUE}Checking Java installation...${NC}"
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✅ Java found: $JAVA_VERSION${NC}"
else
    echo -e "${RED}❌ Java not found${NC}"
    echo "  Install: brew install openjdk@17"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}📋 Next Steps:${NC}"
echo ""
echo "1. Reload your shell configuration:"
echo -e "   ${BLUE}source $SHELL_CONFIG${NC}"
echo ""
echo "2. Create an Android Virtual Device (AVD):"
echo "   - Open Android Studio"
echo "   - Click 'More Actions' → 'Virtual Device Manager'"
echo "   - Click 'Create Device'"
echo "   - Choose 'Pixel 6' or similar"
echo "   - Download a system image (e.g., API 34)"
echo "   - Click 'Finish'"
echo ""
echo "3. Verify setup:"
echo -e "   ${BLUE}cd /Users/pejmanchegoonian/Apps/visamesa/visamesa-root-main/apps/mobile${NC}"
echo -e "   ${BLUE}npx react-native doctor${NC}"
echo ""
echo "4. Run your app:"
echo -e "   ${BLUE}npm run android${NC}"
echo ""
