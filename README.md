# Visamesa Automation

Desktop-browser automation prototype for a local multi-step form mock.

## What this repo contains

- `desktop-inject.js`: a console script that fills configured fields and clicks through a generic multi-step form.
- `mock-flow.html`: a local page that simulates the form sequence for desktop testing.

## How to use

1. Open `mock-flow.html` in a desktop browser.
2. Open DevTools and paste the contents of `desktop-inject.js` into the Console.
3. Set `window.FORM_AUTOMATION_CONFIG` before calling `__formAutomationHelper.start()` if you want to provide values.
4. Watch the console and the page transitions as the helper moves through the local flow.

## Example config

```js
window.FORM_AUTOMATION_CONFIG = {
  debug: true,
  values: {
    passport: "X1234567",
    fullName: "Example Person",
    nationality: "Spanish",
    province: "Barcelona",
    procedure: "Policia-Toma de huellas...",
    accessMode: "presentacion sin clave"
  }
};

__formAutomationHelper.start();
```

## Notes

- This repo is now set up for local desktop testing only.
- The script is designed to stop when it reaches the mock availability screen.
