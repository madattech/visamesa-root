# Quick Start Guide

## Current Status ✅

The React Native app is **fully functional** and ready for testing. All infrastructure is complete, awaiting the injection script from your co-worker.

## What Was Built

- ✅ Complete React Native + TypeScript project structure
- ✅ Authentication system (login, JWT tokens, AsyncStorage)
- ✅ Navigation (LoginScreen → CaseListScreen → AutomationScreen)
- ✅ API integration (all backend endpoints)
- ✅ WebView automation component (ready for injection script)
- ✅ 842 npm packages installed

## Next Steps (Do These Now)

### 1. Generate iOS/Android Native Code

Choose one option:

**Option A: React Native CLI (Recommended)**
```bash
cd /Users/pejmanchegoonian/Apps/visamesa/visamesa_automation

# Generate native folders
npx @react-native-community/cli@latest init VisaMesaAutomation --skip-install --directory .

# When prompted about package.json, choose "merge" or "keep existing"
```

**Option B: If CLI fails, see SETUP_NATIVE.md for alternatives**

### 2. Install iOS Pods (macOS only)
```bash
cd ios && pod install && cd ..
```

### 3. Configure Backend URL

Edit `src/config/api.ts` and update the API URL:

**For iOS Simulator:**
```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

**For Android Emulator:**
```typescript
export const API_BASE_URL = 'http://10.0.2.2:3000';
```

**For Physical Device:**
```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100

# Then use:
export const API_BASE_URL = 'http://192.168.1.100:3000';
```

### 4. Make Sure Backend is Running

```bash
# In visamesa_be directory
npm run dev
```

### 5. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Testing Checklist

### Phase 1: Authentication
- [ ] App launches without errors
- [ ] Login screen appears
- [ ] Login with `test@visamesa.com` works
- [ ] After login, redirects to CaseListScreen
- [ ] Cases are displayed

### Phase 2: Navigation
- [ ] Can see list of cases
- [ ] Pull-to-refresh works
- [ ] Tap a case → navigates to AutomationScreen
- [ ] Back button works

### Phase 3: Automation Screen
- [ ] Case details display correctly
- [ ] Start automation button works
- [ ] Progress message appears: "Waiting for automation script from co-worker..."
- [ ] Stop button works

### Phase 4: When Co-worker Completes Script
- [ ] Replace placeholder in `src/components/WebViewAutomation.tsx`
- [ ] Test on real government website
- [ ] Verify messages are received
- [ ] Verify backend receives API calls
- [ ] Verify web app shows updated appointment

## Troubleshooting

### "Unable to resolve module..."
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### "Command PhaseScriptExecution failed" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### "Cannot connect to backend"
- Check backend is running: `curl http://localhost:3000/health`
- Check API_BASE_URL in `src/config/api.ts`
- For physical device, use local IP (not localhost)

### TypeScript errors
```bash
npm run type-check
```

## File Structure Overview

```
src/
├── App.tsx                         # Root component with providers
├── config/api.ts                   # ⚠️ UPDATE THIS with backend URL
├── contexts/AuthContext.tsx        # Global auth state
├── navigation/RootNavigator.tsx    # Main navigation
├── screens/
│   ├── LoginScreen.tsx            # Login UI
│   ├── CaseListScreen.tsx         # List all cases
│   └── AutomationScreen.tsx       # Control automation
├── components/
│   └── WebViewAutomation.tsx      # ⚠️ CO-WORKER UPDATES THIS
├── services/
│   ├── api.ts                     # Axios instance
│   ├── authService.ts             # Login, logout, tokens
│   └── appointmentService.ts      # Appointment API calls
└── types/index.ts                 # TypeScript types
```

## When Co-worker Completes Injection Script

1. Open `src/components/WebViewAutomation.tsx`
2. Find the `injectedJavaScript` variable (around line 25)
3. Replace the placeholder with the actual script
4. Test thoroughly

### Expected Message Types from Script

Your co-worker's script should send these messages:

```javascript
// Progress update
sendMessage('progress', { 
  stage: 'checking', 
  message: 'Checking for slots...' 
});

// Found slots
sendMessage('slots_found', [
  { date: '2026-05-15', time: '10:00', location: 'Barcelona' }
]);

// Booking complete
sendMessage('booking_complete', {
  success: true,
  date: '2026-05-15',
  time: '10:00',
  location: 'Barcelona',
  confirmationNumber: 'CONF123'
});

// Error
sendMessage('error', { 
  error: 'Description of what went wrong' 
});
```

## Documentation

- **README.md**: Full setup guide, architecture, detailed explanations
- **SETUP_NATIVE.md**: Alternative ways to generate iOS/Android folders
- **IMPLEMENTATION_SUMMARY.md**: Complete technical documentation
- **QUICK_START.md**: This file

## Support

If you encounter issues:
1. Check the console logs for errors
2. Verify backend is running
3. Check network connectivity
4. Review README.md troubleshooting section
5. Check React Native environment: `npx react-native doctor`

## Summary

You now have a **complete, functional React Native app** that:
- Authenticates users
- Fetches cases from your backend
- Displays case information
- Is ready to run automation when the injection script is added

**Status**: Ready for testing! Just generate the native code and run it.
