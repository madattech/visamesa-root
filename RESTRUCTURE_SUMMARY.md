# Repository Restructure Summary

## Changes Made

Restructured the `visamesa_automation` repository to support multiple automation apps instead of a single monolithic app.

### Before (Single App)

```
visamesa_automation/
├── src/
├── package.json
├── README.md (for one app)
└── ... (all files in root)
```

### After (Multi-App Structure)

```
visamesa_automation/
├── shared/                              # Shared code
│   ├── types/common.ts                 # Common types (User, Auth, etc.)
│   └── utils/                          # Shared utilities
├── apps/                               # Individual automations
│   └── mobile/                         # Spanish gov appointment booking
│       ├── src/                        # React Native source code
│       │   ├── App.tsx
│       │   ├── config/
│       │   ├── contexts/
│       │   ├── navigation/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── scripts/cita-previa/
│       │   └── webViewInjection/
│       │   ├── services/
│       │   └── types/
│       ├── package.json
│       ├── node_modules/
│       ├── README.md                   # App-specific docs
│       ├── QUICK_START.md
│       ├── IMPLEMENTATION_SUMMARY.md
│       └── SETUP_NATIVE.md
├── README.md                           # Repository overview
└── .gitignore
```

## Why This Structure?

### 1. Scalability

- Easy to add new automations without affecting existing ones
- Each automation is self-contained
- Clear separation of concerns

### 2. Better Naming

- `mobile` reflects the app's current monorepo location
- Not tied to generic names like "VisaMesaAutomation"
- Future apps have clear, descriptive names

### 3. Code Reusability

- `shared/` folder contains common types and utilities
- Avoid duplicating authentication logic
- Consistent patterns across all automations

### 4. Independent Development

- Each app has its own `package.json` and dependencies
- Can use different React Native versions if needed
- Test and deploy independently

## Current Automations

### 1. Mobile App

**Location**: `apps/mobile/`

**Purpose**: Automate visa appointment booking on Spanish government website

**Website**: https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus

**Status**: ✅ Complete infrastructure, with rule-driven injection ready for additional page rules/scripts

**Features**:

- JWT authentication with AsyncStorage
- Login, CaseList, and Automation screens
- WebView component with message passing
- API integration with visamesa_be backend
- Progress reporting and result handling

## Future Automations

When you need to automate other processes, simply:

1. Create a new folder in `apps/`
2. Name it based on **what** it automates
3. Follow the same pattern as `apps/mobile`
4. Reuse shared types from `../../shared/types`

**Examples**:

- `apps/document-submissions/` - Upload documents automatically
- `apps/status-checks/` - Periodic status monitoring
- `apps/form-prefill/` - Pre-fill government forms
- `apps/payment-automation/` - Handle payment flows

## Naming Guidelines

✅ **Good Names** (describe what is automated):

- `mobile`
- `document-verification`
- `status-monitoring`
- `payment-processing`

❌ **Bad Names** (too generic or implementation-focused):

- `visamesa-automation` (too broad)
- `app1`, `app2` (not descriptive)
- `webview-app` (implementation detail)
- `automation-tool` (too vague)

## Benefits of This Approach

1. **Clear Purpose**: Each automation's name clearly states what it does
2. **Easy Navigation**: Developers instantly know what's in each folder
3. **Independent Versioning**: Each app can evolve independently
4. **Better Testing**: Test each automation separately
5. **Team Collaboration**: Co-workers can work on different automations simultaneously
6. **Documentation**: Each app has its own README and setup guide

## Getting Started

### Run the Extranjería Appointments App

```bash
cd apps/mobile

# Install dependencies
npm install

# Generate iOS/Android native code (first time only)
npx @react-native-community/cli@latest init VisaMesa --skip-install --directory .

# Install iOS pods
cd ios && pod install && cd ..

# Configure backend URL in src/config/api.ts

# Run
npm run ios    # or npm run android
```

See [apps/mobile/QUICK_START.md](apps/mobile/QUICK_START.md) for detailed instructions.

### Add a New Automation

```bash
# Create new app folder
mkdir -p apps/your-automation-name
cd apps/your-automation-name

# Initialize React Native
npx @react-native-community/cli@latest init YourAutomationName

# Copy and adapt structure from apps/mobile
# Update README.md with your automation's details
```

## Shared Code

### Types (`shared/types/common.ts`)

```typescript
// Available for all automations
import { User, AuthResponse, STORAGE_KEYS } from "../../shared/types/common";
```

Currently includes:

- `User`: User object structure
- `AuthResponse`: Login response format
- `STORAGE_KEYS`: AsyncStorage key constants

### Utils (`shared/utils/`)

Placeholder for future shared utilities:

- Date formatting
- API error handling
- Retry logic
- Validation helpers

## Migration Notes

No breaking changes:

- All code from the original single app is intact
- Just moved into `apps/mobile/`
- Documentation updated to reflect new structure
- Ready to use immediately

## Next Steps

1. **Test the restructured app**:

   ```bash
   cd apps/mobile
   npm install
   npm run ios
   ```

2. **When the website flow changes**:
   - Update `apps/mobile/src/webViewInjection/scriptRegistry.ts`
   - Update `apps/mobile/src/webViewInjection/useWebViewInjection.ts`
   - Update `apps/mobile/src/scripts/cita-previa/` when website steps change
   - Test on real government website
   - Deploy to TestFlight/Play Store

3. **When new automations are needed**:
   - Create new folder in `apps/`
   - Follow the established pattern
   - Reuse shared types and utilities

## Summary

✅ Repository now supports multiple automations  
✅ Clear, descriptive naming convention  
✅ Scalable structure for future growth  
✅ Each automation is self-contained  
✅ Shared code for common functionality  
✅ No breaking changes to existing code

The `visamesa_automation` repository is now a **multi-app monorepo** ready for any automation workflow you need!
