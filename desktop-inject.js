(function () {
  "use strict";

  const existing = window.__formAutomationHelper;
  if (existing && existing.running) {
    console.warn("[form-helper] Automation is already running.");
    return;
  }

  const defaultConfig = {
    debug: true,
    delayMs: 250,
    maxSteps: 12,
    values: {
      passport: "s0939081",
      fullName: "Girish Shiva Prasanna Raju Sardar",
      nationality: "India",
      province: "Barcelona",
      procedure: "Visas",
      accessMode: "Online",
    },
    fieldMap: [
      {
        match: ["passport", "documento", "numero", "id"],
        valueKey: "passport",
      },
      { match: ["full name", "nombre completo", "name"], valueKey: "fullName" },
      { match: ["nationality", "nacionalidad"], valueKey: "nationality" },
      { match: ["province", "provincia"], valueKey: "province" },
      { match: ["procedure", "tramite", "tramites"], valueKey: "procedure" },
      { match: ["access mode", "mode", "modalidad"], valueKey: "accessMode" },
    ],
    clickTexts: [
      "continue",
      "continuar",
      "aceptar",
      "solicitar cita",
      "access",
      "acceder",
      "next",
    ],
    stopKeywords: [
      "available dates",
      "fecha disponible",
      "appointment dates",
      "no dates",
    ],
    errorSelectors: [
      '[role="alert"]',
      ".error",
      ".errors",
      ".alert",
      ".invalid-feedback",
      ".field-validation-error",
    ],
  };

  const config = window.FORM_AUTOMATION_CONFIG || defaultConfig;
  const state = {
    running: true,
    stepCount: 0,
    lastAction: null,
  };

  window.__formAutomationHelper = state;

  function log() {
    if (config.debug) {
      console.log.apply(
        console,
        ["[form-helper]"].concat([].slice.call(arguments)),
      );
    }
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchesAny(value, patterns) {
    const text = normalize(value);
    return (patterns || []).some(function (pattern) {
      return text.indexOf(normalize(pattern)) !== -1;
    });
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (!style) return false;
    const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      rect !== null &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : "").trim().toLowerCase();
  }

  function bodyText() {
    return document.body ? textOf(document.body) : "";
  }

  function getErrorNodes() {
    const nodes = [];
    (config.errorSelectors || []).forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (isVisible(el)) nodes.push(el);
      });
    });
    return nodes;
  }

  function getControls() {
    return Array.from(
      document.querySelectorAll(
        'input, select, textarea, button, input[type="submit"], input[type="button"]',
      ),
    ).filter(isVisible);
  }

  function getFields() {
    return Array.from(
      document.querySelectorAll("input, select, textarea"),
    ).filter(isVisible);
  }

  function labelTextForField(field) {
    if (!field) return "";
    if (field.id) {
      const escaped =
        window.CSS && typeof window.CSS.escape === "function"
          ? window.CSS.escape(field.id)
          : field.id;
      const label = document.querySelector('label[for="' + escaped + '"]');
      if (label) return textOf(label);
    }
    const parentLabel = field.closest ? field.closest("label") : null;
    if (parentLabel) return textOf(parentLabel);
    return normalize(
      field.getAttribute("aria-label") ||
        field.getAttribute("placeholder") ||
        field.getAttribute("name") ||
        field.getAttribute("id") ||
        "",
    );
  }

  function setNativeValue(el, value) {
    const previous = el.value;
    el.value = value;
    if (previous !== value) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    }
  }

  function selectOption(selectEl, value) {
    const wanted = normalize(value);
    const option = Array.from(selectEl.options || []).find(function (opt) {
      return (
        normalize(opt.value) === wanted || normalize(opt.textContent) === wanted
      );
    });
    if (!option) return false;
    selectEl.value = option.value;
    selectEl.dispatchEvent(new Event("input", { bubbles: true }));
    selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function setFieldValue(field, value) {
    if (!field || value == null || value === "") return false;
    const tag = field.tagName.toLowerCase();
    const type = normalize(field.type);

    if (tag === "select") {
      return selectOption(field, value);
    }

    if (type === "checkbox") {
      const shouldCheck = Boolean(value);
      if (field.checked !== shouldCheck) field.click();
      return true;
    }

    if (type === "radio") {
      if (
        normalize(field.value) === normalize(value) ||
        normalize(field.getAttribute("aria-label")) === normalize(value)
      ) {
        field.click();
        return true;
      }
      return false;
    }

    if (tag === "input" || tag === "textarea") {
      field.focus();
      setNativeValue(field, String(value));
      return true;
    }

    return false;
  }

  function findFieldByMatch(matchTerms) {
    return (
      getFields().find(function (field) {
        const combined = [
          labelTextForField(field),
          field.getAttribute("name"),
          field.getAttribute("id"),
          field.getAttribute("placeholder"),
          field.getAttribute("aria-label"),
        ]
          .filter(Boolean)
          .join(" ");
        return matchesAny(combined, matchTerms);
      }) || null
    );
  }

  function fillConfiguredFields() {
    let filled = 0;
    (config.fieldMap || []).forEach(function (rule) {
      const value = config.values ? config.values[rule.valueKey] : undefined;
      if (value == null || value === "") return;
      const field = findFieldByMatch(rule.match || []);
      if (!field) {
        log("No field found for", rule.valueKey);
        return;
      }
      if (setFieldValue(field, value)) {
        filled += 1;
        log("Filled", rule.valueKey);
      }
    });
    return filled;
  }

  function findActionByText() {
    return (
      getControls().find(function (el) {
        const label = textOf(el) || normalize(el.getAttribute("value"));
        return label && matchesAny(label, config.clickTexts);
      }) || null
    );
  }

  function isStopScreen() {
    return matchesAny(bodyText(), config.stopKeywords);
  }

  async function settle() {
    await sleep(config.delayMs);
    await sleep(config.delayMs);
  }

  async function step() {
    if (!state.running) return;
    state.stepCount += 1;
    log("Step", state.stepCount, "url=", location.href);

    if (isStopScreen()) {
      log("Reached stop screen. Automation stopped.");
      state.running = false;
      return;
    }

    if (getErrorNodes().length) {
      log("Validation error detected. Stopping.");
      state.running = false;
      return;
    }

    const filled = fillConfiguredFields();
    log("Fields filled:", filled);
    await settle();

    if (isStopScreen()) {
      log("Reached stop screen after fill. Automation stopped.");
      state.running = false;
      return;
    }

    const action = findActionByText();
    if (!action) {
      log("No clickable action found. Stopping.");
      state.running = false;
      return;
    }

    state.lastAction =
      textOf(action) || action.value || action.type || "action";
    log("Clicking:", state.lastAction);
    action.click();
    await settle();

    if (getErrorNodes().length) {
      log("Validation error appeared after click. Stopping.");
      state.running = false;
      return;
    }

    if (isStopScreen()) {
      log("Reached stop screen after click. Automation stopped.");
      state.running = false;
      return;
    }

    if (state.stepCount >= (config.maxSteps || 12)) {
      log("Reached max steps. Stopping.");
      state.running = false;
      return;
    }

    if (state.running) {
      await step();
    }
  }

  state.start = function () {
    state.running = true;
    state.stepCount = 0;
    state.lastAction = null;
    return settle().then(step);
  };

  state.stop = function () {
    state.running = false;
    log("Stopped.");
  };

  state.status = function () {
    return {
      running: state.running,
      stepCount: state.stepCount,
      lastAction: state.lastAction,
      url: location.href,
    };
  };

  log("Loaded. Call `__formAutomationHelper.start()` to run.");
})();
