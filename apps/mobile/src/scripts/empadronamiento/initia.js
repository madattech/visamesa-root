export const EMPADRONAMIENTO_HOME_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca';

export const INITIA_SCRIPT = `
  (function() {
    const selector =
      'a[href*="/oficinavirtual/ca/search-result"][href*="idCategory=21"]';

    const findButtonByText = pattern =>
      Array.from(document.querySelectorAll('button, a, input[type="button"]')).find(
        element => pattern.test(element.textContent || element.value || ''),
      );

    findButtonByText(/accept|acceptar|d'acord|acept/i)?.click();
    window.document.querySelector(selector)?.click();
  })();
  true;
`;
