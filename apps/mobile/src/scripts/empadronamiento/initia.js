export const EMPADRONAMIENTO_HOME_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca';

export const INITIA_SCRIPT = `
  (function() {
    const selector =
      'a[href*="/oficinavirtual/ca/search-result"][href*="idCategory=21"]';

    const tryStart = (attempt = 1) => {
      const link = window.document.querySelector(selector);
      if (link) {
        link.click();
        return;
      }
      if (attempt < 20) {
        setTimeout(() => tryStart(attempt + 1), 250);
      }
    };

    tryStart();
  })();
  true;
`;
