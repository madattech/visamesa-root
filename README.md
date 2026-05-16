# VisaMesa Automation Repository

Mobile automation apps for VisaMesa workflows. Each automation runs on the user's device to avoid IP blocking.

## Repository Structure

```
visamesa_automation/
├── shared/                           # Shared code across all automations
│   ├── types/                       # Common TypeScript types
│   └── utils/                       # Shared utility functions
├── apps/                            # Individual automation apps
│   └── mobile/                      # Mobile automation app
│       ├── src/                    # React Native app code
│       ├── package.json
│       ├── README.md               # App-specific documentation
│       └── ...
└── README.md                        # This file
```

## Current Automations

### 1. **Mobile App** (`apps/mobile`)

Automates visa appointment booking on the Spanish government website.

**Target Website**: https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus

**Status**: ✅ Infrastructure complete, with a rule-driven injection layer ready for additional page rules/scripts

**Tech Stack**: React Native + WebView + JavaScript injection

📖 [View App Documentation →](apps/mobile/README.md)

## Architecture

All automations follow the same pattern:

```
User's Mobile Device (React Native App)
          ↓
    WebView with Injected JavaScript
          ↓
    Target Website (automated interactions)
          ↓
    Results sent to Backend API (visamesa_be)
          ↓
    Web App (visamesa_fe) displays results
```

### Why Mobile Apps?

- **Avoids IP Blocking**: Runs on user's device, not a server
- **User Control**: User initiates and monitors automation
- **Security**: Uses user's own credentials and network
- **Reliability**: No shared infrastructure to get blocked

## Quick Start

### Running an Automation

```bash
# Navigate to the automation you want to run
cd apps/mobile

# Install dependencies
npm install

# Generate native iOS/Android code (first time only)
npx @react-native-community/cli@latest init ExtranjeriaAppointments --skip-install --directory .

# Install iOS pods (macOS only)
cd ios && pod install && cd ..

# Configure backend URL in src/config/api.ts

# Run the app
npm run ios    # iOS simulator
npm run android    # Android emulator
```

See each app's README for detailed setup instructions.

## Prerequisites

**For All Automations**:
- Node.js 18+
- Xcode (iOS development)
- Android Studio (Android development)
- CocoaPods: `sudo gem install cocoapods`
- Running `visamesa_be` backend: `cd visamesa_be && npm run dev`

**Test Account**:
- Email: `test@visamesa.com`
- Backend: `http://localhost:3000`

## Adding New Automations

When you need to automate a new process:

### 1. Create App Directory

```bash
mkdir -p apps/your-automation-name
cd apps/your-automation-name
```

### 2. Initialize React Native

```bash
npx @react-native-community/cli@latest init YourAutomationName
```

### 3. Follow the Pattern

Structure your app like `apps/mobile`:
- Login screen (reuse auth from shared)
- Case/task list screen
- Automation control screen
- WebView component with injection script

### 4. Use Shared Code

```typescript
// Import shared types
import { User, AuthResponse } from '../../shared/types/common';

// Add your automation-specific types
export interface YourCustomType {
  // ...
}
```

### 5. Document

Create a detailed README.md explaining:
- What website/process is being automated
- What the injection script does
- Setup and testing instructions
- Message types for WebView communication

## Naming Convention

Name automations based on **what** they automate, not **how**:

✅ Good:
- `mobile` (booking appointments)
- `document-submissions` (submitting documents)
- `status-checks` (checking application status)

❌ Bad:
- `visamesa-automation` (too generic)
- `webview-app` (implementation detail)
- `app1`, `app2` (not descriptive)

## Shared Code

### `shared/types/common.ts`

Common types used across all automations:
- `User`, `AuthResponse`
- `STORAGE_KEYS`
- `ApiConfig`

### `shared/utils/` (Future)

Reusable utilities:
- Date formatting
- API error handling
- Retry logic
- Validation helpers

## How WebView Automation Works

All apps use the same WebView automation pattern:

### 1. Load Target Website

```typescript
<WebView
  source={{ uri: 'https://target-website.com' }}
  injectedJavaScript={automationScript}
  onMessage={handleMessage}
/>
```

### 2. Inject JavaScript

```javascript
const automationScript = `
  (function() {
    // Helper to send messages back to React Native
    function sendMessage(type, data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: type,
        data: data
      }));
    }
    
    // Access case data injected by React Native
    const caseData = ${JSON.stringify(userData)};
    
    // Automate the website
    // ... your automation logic ...
    
    // Report results
    sendMessage('complete', { success: true, data: {...} });
  })();
`;
```

### 3. Handle Messages

```typescript
const handleMessage = (event) => {
  const message = JSON.parse(event.nativeEvent.data);
  
  switch (message.type) {
    case 'progress':
      updateUI(message.data);
      break;
    case 'complete':
      sendToBackend(message.data);
      break;
    case 'error':
      handleError(message.data);
      break;
  }
};
```

## Testing

Each automation should include:

**Authentication Test**:
- [ ] Login works with test account
- [ ] JWT token is stored and persists
- [ ] Auto-logout on 401 errors

**Data Fetching Test**:
- [ ] Cases/tasks are fetched from backend
- [ ] Data displays correctly
- [ ] Pull-to-refresh works

**Automation Test**:
- [ ] WebView loads target website
- [ ] Script injects successfully
- [ ] Progress messages are received
- [ ] Results are sent to backend
- [ ] Errors are handled gracefully

**End-to-End Test**:
- [ ] Complete flow from login to result
- [ ] Web app shows updated status
- [ ] Edge cases handled

## Troubleshooting

### Cannot connect to backend

**iOS Simulator**: `http://localhost:3000`
**Android Emulator**: `http://10.0.2.2:3000`
**Physical Device**: `http://YOUR_LOCAL_IP:3000`

Find your local IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example: 192.168.1.100
```

### WebView not loading

- Check `javaScriptEnabled={true}`
- Enable `domStorageEnabled={true}`
- Check console logs for errors
- Verify website is accessible

### Build errors

```bash
# Clear caches
rm -rf node_modules
npm install
npm start -- --reset-cache

# iOS
cd ios && pod deintegrate && pod install && cd ..

# Check environment
npx react-native doctor
```

## Future Automations

Potential automations for this repo:

- **Document Upload Automation**: Auto-upload required documents
- **Status Check Automation**: Periodic status checks with notifications
- **Form Pre-fill Automation**: Pre-fill complex government forms
- **Multi-step Process Automation**: Handle multi-page workflows
- **Notification Monitor**: Alert users of important updates

## Development Guidelines

1. **One automation per folder** in `apps/`
2. **Descriptive naming** based on what is automated
3. **Consistent structure** across all apps
4. **Reuse shared code** from `shared/`
5. **Document thoroughly** in app-specific READMEs
6. **Test on real devices** before releasing

## Contributing

When adding a new automation:

1. Create new folder in `apps/`
2. Follow the established pattern
3. Import shared types and utilities
4. Create detailed README
5. Test thoroughly on physical devices
6. Document message types and APIs

## License

See [LICENSE](LICENSE) file.

## Support

- **App-specific questions**: See the app's README in `apps/[app-name]/`
- **General questions**: Check this README
- **React Native issues**: https://reactnative.dev/docs/troubleshooting
