#!/bin/bash

# React Native Setup Verification Script
# Run this script to verify your environment is correctly configured

set -e

echo "🔍 Verifying React Native Setup..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check 1: Node.js version
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "${GREEN}✅ Node.js found: $node_version${NC}"
    
    # Check if version is >= 18
    major_version=$(echo $node_version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$major_version" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version should be 18 or higher${NC}"
        errors=$((errors + 1))
    fi
else
    echo -e "${RED}❌ Node.js not found${NC}"
    errors=$((errors + 1))
fi
echo ""

# Check 2: CLI version
echo "2️⃣  Checking @react-native-community/cli version..."
cli_version=$(npm list @react-native-community/cli --depth=0 2>/dev/null | grep @react-native-community/cli | cut -d'@' -f3)
if [ -n "$cli_version" ]; then
    echo -e "${GREEN}✅ CLI version: $cli_version${NC}"
    
    if [[ "$cli_version" != "16.0.2" ]]; then
        echo -e "${RED}❌ CLI version should be exactly 16.0.2 (found: $cli_version)${NC}"
        echo -e "${YELLOW}   Fix: npm install --save-exact @react-native-community/cli@16.0.2${NC}"
        errors=$((errors + 1))
    fi
else
    echo -e "${RED}❌ CLI not found in dependencies${NC}"
    errors=$((errors + 1))
fi
echo ""

# Check 3: .xcode.env.local (should NOT exist or should have correct path)
echo "3️⃣  Checking iOS Xcode environment..."
if [ -f "ios/.xcode.env.local" ]; then
    echo -e "${YELLOW}⚠️  Found ios/.xcode.env.local${NC}"
    
    # Check if NODE_BINARY path exists
    if grep -q "NODE_BINARY=" ios/.xcode.env.local; then
        node_path=$(grep "NODE_BINARY=" ios/.xcode.env.local | cut -d'=' -f2)
        if [ -f "$node_path" ]; then
            echo -e "${GREEN}✅ NODE_BINARY path is valid: $node_path${NC}"
        else
            echo -e "${RED}❌ NODE_BINARY path does not exist: $node_path${NC}"
            echo -e "${YELLOW}   Fix: rm ios/.xcode.env.local${NC}"
            errors=$((errors + 1))
        fi
    fi
    
    echo -e "${YELLOW}   Note: .xcode.env.local is machine-specific and should not be committed${NC}"
    warnings=$((warnings + 1))
else
    echo -e "${GREEN}✅ No .xcode.env.local (using default .xcode.env)${NC}"
fi
echo ""

# Check 4: .gitignore includes .xcode.env.local
echo "4️⃣  Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "\.xcode\.env\.local" .gitignore; then
        echo -e "${GREEN}✅ .xcode.env.local is in .gitignore${NC}"
    else
        echo -e "${YELLOW}⚠️  .xcode.env.local not in .gitignore${NC}"
        echo -e "${YELLOW}   This could cause issues for other developers${NC}"
        warnings=$((warnings + 1))
    fi
else
    echo -e "${RED}❌ .gitignore not found${NC}"
    errors=$((errors + 1))
fi
echo ""

# Check 5: .npmrc exists
echo "5️⃣  Checking .npmrc..."
if [ -f ".npmrc" ]; then
    echo -e "${GREEN}✅ .npmrc found${NC}"
    if grep -q "save-exact=true" .npmrc; then
        echo -e "${GREEN}✅ save-exact=true is set${NC}"
    else
        echo -e "${YELLOW}⚠️  save-exact=true not set in .npmrc${NC}"
        warnings=$((warnings + 1))
    fi
else
    echo -e "${YELLOW}⚠️  .npmrc not found${NC}"
    echo -e "${YELLOW}   Consider creating one with: save-exact=true${NC}"
    warnings=$((warnings + 1))
fi
echo ""

# Check 6: Xcode (macOS only)
echo "6️⃣  Checking Xcode (macOS only)..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcode-select &> /dev/null; then
        xcode_path=$(xcode-select -p)
        echo -e "${GREEN}✅ Xcode found at: $xcode_path${NC}"
    else
        echo -e "${RED}❌ Xcode not found${NC}"
        errors=$((errors + 1))
    fi
    
    # Check CocoaPods
    if command -v pod &> /dev/null; then
        pod_version=$(pod --version)
        echo -e "${GREEN}✅ CocoaPods found: $pod_version${NC}"
    else
        echo -e "${RED}❌ CocoaPods not found${NC}"
        echo -e "${YELLOW}   Install: sudo gem install cocoapods${NC}"
        errors=$((errors + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Not on macOS, skipping iOS checks${NC}"
fi
echo ""

# Check 7: node_modules exists
echo "7️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules directory exists${NC}"
else
    echo -e "${RED}❌ node_modules not found${NC}"
    echo -e "${YELLOW}   Run: npm ci${NC}"
    errors=$((errors + 1))
fi
echo ""

# Check 8: iOS Pods (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "8️⃣  Checking iOS Pods..."
    if [ -d "ios/Pods" ]; then
        echo -e "${GREEN}✅ iOS Pods installed${NC}"
    else
        echo -e "${YELLOW}⚠️  iOS Pods not installed${NC}"
        echo -e "${YELLOW}   Run: cd ios && pod install${NC}"
        warnings=$((warnings + 1))
    fi
    echo ""
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your setup is correct.${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Setup is OK but has $warnings warning(s).${NC}"
    echo -e "${YELLOW}   Consider addressing them for best results.${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $errors error(s) and $warnings warning(s).${NC}"
    echo -e "${RED}   Please fix the errors before running the app.${NC}"
    exit 1
fi
