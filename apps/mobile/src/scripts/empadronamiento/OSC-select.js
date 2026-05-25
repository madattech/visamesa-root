export const EMPADRONAMIENTO_SEARCH_RESULT_PATH = '/search-result';

export const EMPADRONAMIENTO_SEARCH_RESULT_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/search-result?idCategory=21';

const TARGET_TEXT = "Cita amb les Oficines d'Atenció Ciutadana";

export const OSC_SELECT_SCRIPT = `
  (function() {
    const selectOAC = () => {
      const paragraphs = window.document.querySelectorAll('p');
      for (var index = 0; index < paragraphs.length; index += 1) {
        var paragraph = paragraphs[index];
        if (paragraph.textContent.trim() === ${JSON.stringify(TARGET_TEXT)}) {
          paragraph.click();
          return true;
        }
      }
      return false;
    };

    if (!selectOAC()) {
      setTimeout(selectOAC, 250);
    }
  })();
  true;
`;
