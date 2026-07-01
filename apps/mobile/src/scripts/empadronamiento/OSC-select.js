export const EMPADRONAMIENTO_SEARCH_RESULT_PATH = '/search-result';

export const EMPADRONAMIENTO_SEARCH_RESULT_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/search-result?idCategory=21';

const TARGET_TEXT = "Cita amb les Oficines d'Atenció Ciutadana";

export const OSC_SELECT_SCRIPT = `
  (function() {
    const targetText = ${JSON.stringify(TARGET_TEXT)};
    const normalize = value => (value || '').replace(/\\s+/g, ' ').trim();

    const target = Array.from(
      document.querySelectorAll('p, a, button, [role="button"]'),
    ).find(element => normalize(element.textContent).includes(targetText));
    const clickable =
      target?.closest('a, button, [role="button"]') ||
      target?.parentElement?.closest('a, button, [role="button"]') ||
      target;

    clickable?.click();
  })();
  true;
`;
