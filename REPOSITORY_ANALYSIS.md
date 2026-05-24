# Repository Analysis

## Purpose

This repository contains the mobile automation side of the VisaMesa product. Its main job is to run appointment-booking automation from a user's own device against the Spanish government's immigration appointment system instead of from a shared backend IP.

At the moment, the repository is effectively a small monorepo with one real app:

- `apps/mobile`: a React Native application that embeds the government website in a `WebView` and injects page-specific JavaScript to move through the "cita previa" flow.
- `shared/types`: shared TypeScript interfaces and storage-key constants intended for reuse across future automation apps.
- `shared/utils`: placeholder area for future shared helpers; no production utilities exist there yet.

## High-Level Product Model

The intended system looks like this:

1. A user manages immigration cases in the VisaMesa web product.
2. The VisaMesa backend stores case, profile, and appointment state.
3. This mobile app logs in to the backend, fetches cases, and starts automation for a selected case.
4. A hidden `WebView` opens the Spanish government site and injects scripts page by page.
5. The mobile app reports slot availability and booking outcomes back to the backend.

That intended flow is still visible in the codebase, but the currently wired runtime entrypoint is narrower than the full product vision. The active navigator currently boots directly into a browser-style `WebView` screen rather than the auth-driven case workflow.

## Repository Structure

```text
visamesa-root/
├── apps/
│   └── mobile/
│       ├── android/                  # Native Android shell
│       ├── ios/                      # Native iOS shell
│       ├── src/
│       │   ├── components/           # Reusable app components
│       │   ├── config/               # API base URL and endpoint builders
│       │   ├── contexts/             # Auth state container
│       │   ├── navigation/           # React Navigation stack
│       │   ├── screens/              # UI screens
│       │   ├── scripts/cita-previa/  # Page-specific automation scripts
│       │   ├── services/             # Axios clients for auth and appointments
│       │   ├── types/                # App-local domain types
│       │   └── webViewInjection/     # Rule matching and script injection
│       ├── README.md
│       ├── QUICK_START.md
│       ├── SETUP_NATIVE.md
│       └── IMPLEMENTATION_SUMMARY.md
├── shared/
│   ├── types/common.ts
│   └── utils/README.md
├── README.md
├── RESTRUCTURE_SUMMARY.md
└── countrieslist.txt
```

## What The App Actually Does Today

### Runtime entrypoint

- `apps/mobile/src/App.tsx` mounts `NavigationContainer` and `SafeAreaProvider`.
- `apps/mobile/src/navigation/RootNavigator.tsx` currently exposes only one screen: `WebsiteWebView`.
- The initial route is `WebsiteWebView`, so the app opens directly into the government-site browser experience.

### Active user-facing screen

- `apps/mobile/src/screens/WebsiteWebViewScreen.tsx` loads the ICP Plus entry URL in a visible `WebView`.
- It builds a set of injection rules using `buildCitaPreviaInjectionRules`.
- It passes navigation and page-load events into `useWebViewInjection`, which decides when a page-specific script should be injected.

### Browser automation engine

The automation engine is split into two layers:

1. Rule matching and timing:
   - `apps/mobile/src/webViewInjection/scriptRegistry.ts`
   - `apps/mobile/src/webViewInjection/useWebViewInjection.ts`
2. Website-specific scripts:
   - `apps/mobile/src/scripts/cita-previa/*.js`
   - `apps/mobile/src/scripts/cita-previa/index.ts`

The `useWebViewInjection` hook tracks the current URL, matches it against a rule, optionally polls for a "ready" selector, and only then injects the page script. This is the most mature and best-tested part of the repository.

## The Cita Previa Automation Flow

The target website is the Spanish government immigration appointment flow:

- ICP Plus landing page:
  `https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus`

The current scripted flow covers these stages:

1. `initialPage.js`
   - clicks the submit button on the public ICP Plus landing page.
2. `provincia.js`
   - waits for the province dropdown.
   - selects a province by numeric option index.
   - clicks the accept button.
   - emits debug messages back to React Native.
3. `clave.js`
   - clicks the "sin clave" style entry button.
4. `details.js`
   - fills ID/NIE, full name, and nationality.
   - dispatches `input` and `change` events.
   - submits the form.
5. `oficina.js`
   - selects a procedure/tramite by numeric option index.
   - clicks accept.
6. `solicitarCita.js`
   - clicks the send button on the validation page.

### Automation profile

`apps/mobile/src/scripts/cita-previa/config.ts` defines the profile shape used to parameterize the scripts:

- `details.nie`
- `details.Name`
- `details.nationality`
- `details.documentType`
- `provinceOptionIndex`
- `tramitesOptionIndex`

The repository includes a hardcoded default config for manual runs:

- NIE: `Y6950398L`
- Name: `Girish Sardar`
- Nationality index: `88`
- Province option index: `9`
- Tramite option index: `17`

This is important: the browser screen currently uses this static profile, while the hidden automation component can derive the profile from a backend case.

## Intended Backend-Connected Flow

The repository still contains a fuller product path for authenticated case-based automation.

### Auth layer

- `apps/mobile/src/contexts/AuthContext.tsx`
- `apps/mobile/src/services/authService.ts`
- `apps/mobile/src/services/api.ts`

These files implement:

- JWT login via `POST /auth/login`
- current-user lookup via `GET /auth/me`
- token persistence in `AsyncStorage`
- automatic `Authorization` header injection through Axios interceptors
- token clearing on `401`

### Case and appointment layer

`apps/mobile/src/services/appointmentService.ts` wraps backend endpoints for:

- all cases for a user
- pending appointments
- appointment status
- reporting discovered slots
- reporting booking results

### Screens for the fuller flow

- `LoginScreen.tsx`
- `CaseListScreen.tsx`
- `AutomationScreen.tsx`
- `components/WebViewAutomation.tsx`

Those files show the intended end-to-end product:

1. log in,
2. fetch cases,
3. pick a case,
4. run hidden browser automation,
5. post results back to the backend.

`WebViewAutomation.tsx` is the version that hides the `WebView` from the user and builds the automation profile from `caseData.profile`.

## Current Integration Gaps

This repo is not just "unfinished"; it has two parallel states in code:

### 1. The wired app path is browser-only

`RootNavigator.tsx` currently mounts only `WebsiteWebViewScreen`. The login, case list, and automation screens are defined but not reachable through the active navigator.

### 2. `AuthProvider` is not mounted

`AuthContext.tsx` is implemented, but `App.tsx` does not wrap the tree in `AuthProvider`. As a result, any screen using `useAuth()` would crash if routed to in the current app setup.

### 3. Docs are partially stale

Several docs still describe a pre-native or earlier wiring state:

- `README.md`
- `RESTRUCTURE_SUMMARY.md`
- `QUICK_START.md`
- `SETUP_NATIVE.md`
- `IMPLEMENTATION_SUMMARY.md`

Examples of drift:

- some docs still refer to the repo as `visamesa_automation`.
- some setup docs say the native `ios/` and `android/` folders still need to be generated, but they already exist in the repository.
- some docs describe login-driven navigation as the current runtime, but that is not what `RootNavigator.tsx` does today.

### 4. Automation data is only partly dynamic

The hidden automation flow can derive values from a case, but province and tramite selection are still driven by fixed numeric indices from defaults. That makes the automation fragile if:

- the government site changes option order,
- different procedures need different mappings,
- different users need different provinces or workflows.

### 5. End-to-end booking completion is still lightweight

The page scripts mostly click through known steps. They do not yet show robust DOM parsing for:

- extracting available slots,
- selecting among multiple slots,
- handling anti-bot or challenge flows,
- recovering from validation or navigation errors,
- adapting to layout changes.

The infrastructure is there, but the domain logic is still thin.

## Native App Shell

The mobile app already includes generated native projects.

### Android

Key observations:

- package namespace and application ID:
  `com.extranjeriaappointments`
- `INTERNET` permission is enabled.
- cleartext traffic is allowed via manifest placeholder, which supports local backend development.
- release builds still use the debug signing config, which is fine for local development but not for production distribution.

### iOS

Key observations:

- app target name: `ExtranjeriaAppointments`
- local networking is allowed through `NSAllowsLocalNetworking`.
- arbitrary network loads are not globally enabled.
- the app is configured as portrait-first on phone.

### App metadata

`apps/mobile/app.json` exposes:

- name: `ExtranjeriaAppointments`
- display name: `VisaMesa Appointments`

## Data Models

The main app-local types live in `apps/mobile/src/types/index.ts`.

The important domain objects are:

- `User`
- `Case`
- `Appointment`
- `AppointmentSlot`
- `AutomationProgress`
- `CitaPreviaDetails`

The `Case` model is the key bridge between VisaMesa backend data and automation. It includes:

- procedure metadata
- profile identity data
- optional nested profile details for automation-specific fields
- optional current appointment state

The `shared/types/common.ts` file duplicates some of the auth/storage types, which suggests the monorepo-sharing plan is not fully consolidated yet.

## Tests And Confidence Level

The repository has unit coverage around the injection framework, not around full mobile flows.

Passing test suites:

- `src/webViewInjection/useWebViewInjection.test.tsx`
- `src/webViewInjection/scriptRegistry.test.ts`
- `src/scripts/cita-previa/index.test.ts`

What these tests prove:

- URL rule matching works.
- readiness polling works.
- injection only happens once per matching URL/load cycle.
- cita-previa rule construction contains the expected URLs and selectors.

What is not covered:

- authenticated app navigation
- backend API integration against a running server
- parsing real government-site responses
- slot extraction and booking outcomes
- native platform behavior on iOS/Android devices

## Supporting Files

### `countrieslist.txt`

This file appears to be a raw list of nationality labels from the government flow. It is not currently wired into the app code, but it is likely a reference aid for mapping nationality indices used in `details.js`.

### Shared utilities area

`shared/utils/README.md` is only a placeholder. No reusable shared helper layer exists yet.

## Operational Summary

If you want the shortest accurate description of the repo:

- This is a React Native mobile automation repository for VisaMesa.
- Its strongest current implementation is a rule-driven `WebView` injection engine for the Spanish "cita previa" flow.
- It contains the skeleton of a fuller authenticated case-management workflow tied to the VisaMesa backend.
- The current runtime entrypoint is a direct browser/injection screen, not the full auth/case experience described in older docs.
- Native Android and iOS shells already exist.
- The test coverage is focused on injection infrastructure, not full workflow execution.

## Practical Reading Guide

If someone new needs to understand the repo quickly, these are the highest-value files in order:

1. `apps/mobile/src/screens/WebsiteWebViewScreen.tsx`
2. `apps/mobile/src/webViewInjection/useWebViewInjection.ts`
3. `apps/mobile/src/webViewInjection/scriptRegistry.ts`
4. `apps/mobile/src/scripts/cita-previa/index.ts`
5. `apps/mobile/src/scripts/cita-previa/*.js`
6. `apps/mobile/src/components/WebViewAutomation.tsx`
7. `apps/mobile/src/screens/AutomationScreen.tsx`
8. `apps/mobile/src/services/api.ts`
9. `apps/mobile/src/services/authService.ts`
10. `apps/mobile/src/services/appointmentService.ts`

## Current State Assessment

The repo is best understood as a working automation foundation with partial product wiring around it.

What is solid:

- React Native shell
- WebView rule matching
- readiness-aware injection timing
- page-step scripting structure
- unit tests around injection behavior

What is partial:

- navigation integration
- auth-provider wiring
- dynamic case-driven automation configuration
- fresh and accurate repository documentation
- end-to-end appointment booking resilience

That distinction matters because the repository is not empty scaffolding. It already contains meaningful automation infrastructure, but the product-level orchestration still needs consolidation.
