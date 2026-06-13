export type WebViewScriptSnippet = string | false | null | undefined;

export interface ComposeWebViewScriptOptions {
  async?: boolean;
}

const serialize = (value: unknown) => JSON.stringify(value);

const helperScript = `
  const automation = {
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    query: (selector) => window.document.querySelector(selector),
    queryAll: (selector) => Array.from(window.document.querySelectorAll(selector)),
    has: (selector) => Boolean(window.document.querySelector(selector)),
    findByText: (selector, text) => {
      return Array.from(window.document.querySelectorAll(selector)).find(element => {
        return (element.textContent || '').trim() === text;
      }) || null;
    },
    click: (selector) => {
      const element = window.document.querySelector(selector);

      if (!element) {
        console.warn('[automation] element not found', selector);
        return false;
      }

      element.click();
      return true;
    },
    clickByText: (selector, text) => {
      const element = automation.findByText(selector, text);

      if (!element) {
        console.warn('[automation] text element not found', {selector, text});
        return false;
      }

      element.click();
      return true;
    },
    dispatchFieldEvents: (element) => {
      element.dispatchEvent(new Event('input', {bubbles: true}));
      element.dispatchEvent(new Event('change', {bubbles: true}));
      element.dispatchEvent(new Event('blur', {bubbles: true}));
    },
    setField: (selector, value) => {
      const element = window.document.querySelector(selector);

      if (!element || value === undefined || value === null) {
        console.warn('[automation] field not found', selector);
        return false;
      }

      element.value = value;
      automation.dispatchFieldEvents(element);
      return true;
    },
    selectByValue: (selector, value) => {
      const element = window.document.querySelector(selector);

      if (!element || value === undefined || value === null) {
        console.warn('[automation] select not found', selector);
        return false;
      }

      element.value = value;
      automation.dispatchFieldEvents(element);
      return true;
    },
    selectByText: (selector, text) => {
      const element = window.document.querySelector(selector);
      const option = Array.from(element?.options || []).find(item => {
        return (item.textContent || '').trim() === text;
      });

      if (!element || !option) {
        console.warn('[automation] select option text not found', {selector, text});
        return false;
      }

      element.value = option.value;
      automation.dispatchFieldEvents(element);
      return true;
    },
    selectByIndex: (selector, index) => {
      const element = window.document.querySelector(selector);
      const option = element?.options?.[index];

      if (!element || !option) {
        console.warn('[automation] select option index not found', {selector, index});
        return false;
      }

      option.selected = true;
      automation.dispatchFieldEvents(element);
      return true;
    },
    submit: (selector = 'button[type="submit"]') => automation.click(selector),
    postDebug: (stage, payload = {}) => {
      try {
        const bridge = window.ReactNativeWebView;

        if (!bridge || typeof bridge.postMessage !== 'function') {
          return;
        }

        bridge.postMessage(JSON.stringify({
          type: 'debug',
          data: {
            stage,
            ...payload,
          },
        }));
      } catch (error) {
        console.log('[automation]', stage, payload, error);
      }
    },
    nextWeekday: (from = new Date()) => {
      const date = new Date(from);
      date.setHours(0, 0, 0, 0);

      const day = date.getDay();

      if (day === 5) {
        date.setDate(date.getDate() + 3);
      } else if (day === 6) {
        date.setDate(date.getDate() + 2);
      } else {
        date.setDate(date.getDate() + 1);
      }

      return date;
    },
    parseCatalanDate: (label) => {
      const monthsCa = {
        gener: 0,
        febrer: 1,
        març: 2,
        abril: 3,
        maig: 4,
        juny: 5,
        juliol: 6,
        agost: 7,
        setembre: 8,
        octubre: 9,
        novembre: 10,
        desembre: 11,
      };
      const match = label?.match(/^(\\d{1,2}) de (\\w+) del (\\d{4})$/);

      if (!match) {
        return null;
      }

      const [, day, monthName, year] = match;
      return new Date(Number(year), monthsCa[monthName.toLowerCase()], Number(day));
    },
    pickFirstAvailableDate: () => {
      const minDate = automation.nextWeekday();
      const cells = automation.queryAll('mat-calendar td[role="button"][aria-label]');
      const availableCells = cells
        .filter(cell => !cell.className.includes('disabled-date'))
        .map(cell => ({
          cell,
          date: automation.parseCatalanDate(cell.getAttribute('aria-label')),
        }))
        .filter(item => item.date && item.date >= minDate)
        .sort((a, b) => a.date - b.date);

      if (!availableCells.length) {
        console.log('[automation] no available date found');
        return false;
      }

      availableCells[0].cell.click();
      return true;
    },
    pickFirstTimeAfter: (minTime = '10:00') => {
      const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      const min = toMinutes(minTime);
      const times = automation.queryAll('input[type="radio"][name="hora"][aria-label]')
        .map(input => ({
          input,
          time: input.getAttribute('aria-label'),
          minutes: toMinutes(input.getAttribute('aria-label')),
        }))
        .filter(item => item.minutes >= min)
        .sort((a, b) => a.minutes - b.minutes);

      if (!times.length) {
        return false;
      }

      times[0].input.click();
      return true;
    },
  };
`;

export const composeWebViewScript = (
  snippets: WebViewScriptSnippet[],
  options: ComposeWebViewScriptOptions = {},
) => {
  const body = snippets.filter(Boolean).join('\n');
  const functionPrefix = options.async ? 'async function' : 'function';

  return `
    (${functionPrefix}() {
      ${helperScript}
      ${body}
    })();
    true;
  `;
};

export const click = (selector: string) =>
  `automation.click(${serialize(selector)});`;

export const clickByText = (selector: string, text: string) =>
  `automation.clickByText(${serialize(selector)}, ${serialize(text)});`;

export const setField = (selector: string, value: string) =>
  `automation.setField(${serialize(selector)}, ${serialize(value)});`;

export const selectByValue = (selector: string, value: string) =>
  `automation.selectByValue(${serialize(selector)}, ${serialize(value)});`;

export const selectByText = (selector: string, text: string) =>
  `automation.selectByText(${serialize(selector)}, ${serialize(text)});`;

export const selectByIndex = (selector: string, index: number) =>
  `automation.selectByIndex(${serialize(selector)}, ${index});`;

export const submit = (selector?: string) =>
  selector ? `automation.submit(${serialize(selector)});` : 'automation.submit();';

export const delay = (ms: number) => `await automation.delay(${ms});`;

export const step = (body: string) => body;
