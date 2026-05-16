# Extranjería Appointments Automation

React Native app for automating visa appointment booking on the Spanish government's immigration website.

## Target Website

**URL**: https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus

**Official Name**: "Cita previa de extranjería"  
**Purpose**: Appointment booking for immigration procedures (work permits, residency, family reunification, etc.)

**Website Details**:
- Operated by: Delegaciones y Subdelegaciones del Gobierno
- Requires: Passport number, nationality, procedure type, preferred location
- Challenge: Appointments fill up quickly, manual booking is time-consuming

## What This App Does

This React Native app automates the entire appointment booking process:

1. **User logs in** with VisaMesa credentials (same account as web app)
2. **Fetches visa cases** from backend that need appointments
3. **User selects a case** and starts automation
4. **WebView loads** the government website in background (hidden from user)
5. **JavaScript injection** automates:
   - Navigating the appointment system
   - Filling forms with case data (name, passport, procedure type, location)
   - Checking for available appointment slots
   - Booking the first available slot (or user-preferred slot)
6. **Reports results** back to VisaMesa backend API
7. **Web app displays** the booked appointment details

## Architecture

This app is part of the VisaMesa ecosystem:

```
┌─────────────────────────────────────────────────────────────┐
│                     VisaMesa Web App                        │
│                   (visamesa_fe - React)                     │
│  User creates visa case, enters profile data, views status │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    VisaMesa Backend                         │
│                  (visamesa_be - Fastify)                    │
│     Stores cases, appointments, user data (PostgreSQL)     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│           THIS APP - Mobile Automation                      │
│      (React Native + WebView + JS Injection)                │
│  Runs on user's phone, automates government website        │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Government Website                         │
│     sede.administracionespublicas.gob.es                    │
│            (automated via WebView)                          │
└─────────────────────────────────────────────────────────────┘
```

## Features

- ✅ JWT authentication with token persistence
- ✅ Fetch and display all user's visa cases
- ✅ Case selection and automation control
- ✅ Hidden WebView for background automation
- ✅ Real-time progress updates
- ✅ Slot detection and reporting
- ✅ Booking result handling
- ✅ Error recovery and reporting
- ✅ Pull-to-refresh case list
- ✅ Status badges and visual feedback

## Tech Stack

- **React Native** 0.76.8
- **TypeScript** for type safety
- **React Navigation** for screens
- **React Native WebView** for automation
- **Axios** for API calls
- **AsyncStorage** for token persistence

## Setup

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

### Quick Setup

```bash
# Install dependencies
npm install

# Generate iOS/Android native code (first time only)
npx @react-native-community/cli@latest init ExtranjeriaAppointments --skip-install --directory .

# Install iOS pods (macOS only)
cd ios && pod install && cd ..

# Configure backend URL in src/config/api.ts
# - iOS Simulator: http://localhost:3000
# - Android Emulator: http://10.0.2.2:3000
# - Physical Device: http://YOUR_LOCAL_IP:3000

# Run the app
npm run ios    # or npm run android
```

## Project Structure

```
src/
├── App.tsx                         # Root component with providers
├── config/
│   └── api.ts                     # Backend API configuration ⚠️ UPDATE THIS
├── contexts/
│   └── AuthContext.tsx            # Global authentication state
├── navigation/
│   └── RootNavigator.tsx          # Main app navigation
├── screens/
│   ├── LoginScreen.tsx            # JWT authentication UI
│   ├── CaseListScreen.tsx         # Display all user cases
│   └── AutomationScreen.tsx       # Control automation, show progress
├── components/
│   └── WebViewAutomation.tsx      # Hidden automation WebView for case workflows
├── scripts/
│   └── cita-previa/               # Page-specific WebView scripts
├── webViewInjection/
│   ├── scriptRegistry.ts          # URL rules and active script resolution
│   └── useWebViewInjection.ts     # WebView URL tracking and injection hook
├── services/
│   ├── api.ts                     # Axios instance with interceptors
│   ├── authService.ts             # Login, logout, token management
│   └── appointmentService.ts      # Appointment API calls
└── types/
    └── index.ts                   # TypeScript type definitions
```

## WebView Automation

The browser injection layer is in `src/webViewInjection/`, and page-specific scripts live under `src/scripts/cita-previa/`.

### How It Works

1. **WebView loads** the government website in a hidden view
2. **The hook tracks the active URL** and resolves a matching rule from `scriptRegistry.ts`
3. **JavaScript is injected** into the page for the active rule only
4. **Script automates** the website:
   - Navigates to appointment booking
   - Fills forms (name, passport, procedure, location)
   - Checks for available slots
   - Books an appointment if slots are found
5. **Messages sent** back to React Native via `window.ReactNativeWebView.postMessage()`
6. **React Native handles** messages and updates UI/backend

### Injection Script Status

**Current**: Rule-driven injection layer with an ICP Plus entry in `src/webViewInjection/scriptRegistry.ts`  
**Extend it**: Add more rules in `src/webViewInjection/scriptRegistry.ts` and page scripts in `src/scripts/cita-previa/`  
**Browser screen**: `src/screens/WebsiteWebViewScreen.tsx`

### Message Types

The injection script communicates with React Native using these message types:

```javascript
// Progress update
sendMessage('progress', { 
  stage: 'checking', 
  message: 'Looking for available slots...' 
});

// Slots found
sendMessage('slots_found', [
  { date: '2026-05-15', time: '10:00', location: 'Barcelona' },
  { date: '2026-05-16', time: '14:30', location: 'Barcelona' }
]);

// Booking complete
sendMessage('booking_complete', {
  success: true,
  date: '2026-05-15',
  time: '10:00',
  location: 'Barcelona',
  confirmationNumber: 'CONF-12345'
});

// Error
sendMessage('error', { 
  error: 'No slots available' 
});
```

## API Integration

This app communicates with `visamesa_be` backend:

### Endpoints Used

**Authentication**:
- `POST /auth/login` - Login with email/password, get JWT
- `GET /auth/me` - Get current user info

**Appointments**:
- `GET /appointments/cases/:userId` - Get all user cases
- `GET /appointments/pending/:userId` - Get cases needing automation
- `GET /appointments/status/:caseId` - Get appointment status for a case
- `POST /appointments/check-availability` - Report found slots to backend
- `POST /appointments/book-result` - Report booking success/failure

All requests automatically include JWT token via Axios interceptor.

## Testing

### Test Account

- **Email**: `test@visamesa.com`
- **Password**: (set in backend seed script)
- **Backend**: Must be running on `http://localhost:3000`

### Testing Checklist

**Phase 1: Authentication**
- [ ] App launches without errors
- [ ] Login screen displays
- [ ] Login with test account works
- [ ] Token persists across app restarts
- [ ] Redirects to CaseListScreen after login

**Phase 2: Case Management**
- [ ] Cases fetch from backend
- [ ] Cases display with correct data
- [ ] Pull-to-refresh works
- [ ] Status badges show correct colors
- [ ] Tap case navigates to AutomationScreen

**Phase 3: Automation (Current)**
- [ ] Case details display correctly
- [ ] Start automation button works
- [ ] Progress message reflects the current automation stage
- [ ] Stop button works

**Phase 4: Automation (After Extending the Script Set)**
- [ ] WebView loads government website
- [ ] Script injects successfully
- [ ] Progress updates appear
- [ ] Slots are found and displayed
- [ ] Backend receives check-availability call
- [ ] Booking completes
- [ ] Backend receives book-result call
- [ ] Web app shows updated appointment
- [ ] Error handling works

## Troubleshooting

### Cannot connect to backend

Check backend URL configuration in `src/config/api.ts`:

- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000` (10.0.2.2 = host machine)
- **Physical Device**: `http://YOUR_LOCAL_IP:3000`

Find your local IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example: 192.168.1.100
```

Verify backend is running:
```bash
curl http://localhost:3000/health
```

### WebView not loading

- Check `javaScriptEnabled={true}` in WebView props
- Enable `domStorageEnabled={true}`
- Check console logs for errors
- Test government website in browser first

### Script injection not working

- Enable JavaScript in WebView
- Check for syntax errors in injection script
- Test with simple `console.log` first
- Review WebView error messages

### Build errors

```bash
# Clear everything
rm -rf node_modules
npm install
npm start -- --reset-cache

# iOS
cd ios
pod deintegrate
pod install
cd ..

# Check environment
npx react-native doctor
```

## When You Add Another Page

### Integration Steps

1. **Open** `src/webViewInjection/scriptRegistry.ts`
2. **Add** a new URL rule for the target page
3. **Add or update** page-specific script files in `src/scripts/cita-previa/`
4. **Test** on the real government website
5. **Verify** all message types work correctly
6. **Deploy** to TestFlight/Play Store for testing

### Script Requirements

The injected script must:
- ✅ Navigate the government website
- ✅ Fill forms with `caseData` (automatically injected)
- ✅ Check for available appointment slots
- ✅ Book an appointment when found
- ✅ Send progress messages via `sendMessage()`
- ✅ Handle errors gracefully
- ✅ Report final result (success/failure)

## Deployment

### iOS (TestFlight)

1. Open `ios/ExtranjeriaAppointments.xcworkspace` in Xcode
2. Set version and build number
3. Archive for distribution
4. Upload to App Store Connect
5. Add to TestFlight for internal/external testing

### Android (Play Store)

1. Generate release APK/AAB
2. Sign with release keystore
3. Upload to Play Console
4. Create internal testing track
5. Distribute to testers

## Future Enhancements

- **Background Tasks**: Continue automation when app is backgrounded
- **Push Notifications**: Alert user when appointment is found
- **Scheduled Automation**: Run at specific times (e.g., daily at 8am)
- **Multi-case Automation**: Process multiple cases in parallel
- **Retry Logic**: Auto-retry on failures with exponential backoff
- **Analytics**: Track success rates, time to find slots
- **Location Preferences**: Allow user to specify preferred locations

## Important Notes

- **IP Blocking Prevention**: This is why automation runs on the user's device (their IP address)
- **Rate Limiting**: Add delays between requests in injection script to avoid detection
- **Error Handling**: Government website may change structure, script should handle gracefully
- **User Privacy**: Never log or expose sensitive user data (passport numbers, etc.)
- **Security**: JWT tokens stored in AsyncStorage (consider Keychain/Keystore for production)

## Documentation

- **[QUICK_START.md](QUICK_START.md)**: Fast setup guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**: Detailed technical documentation
- **[SETUP_NATIVE.md](SETUP_NATIVE.md)**: Alternative native setup methods

## License

See [LICENSE](../../LICENSE) in repository root.

## Support

For issues or questions:
- Check [QUICK_START.md](QUICK_START.md) troubleshooting section
- Review React Native docs: https://reactnative.dev/docs/troubleshooting
- Check backend logs if API calls fail
- Test government website accessibility first
