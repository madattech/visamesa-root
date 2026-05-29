export const EMPADRONAMIENTO_TRAMIT_PATH = '/tramit/20230001668';

export const EMPADRONAMIENTO_TRAMIT_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/tramit/20230001668';

const START_TRAMIT_LABEL = 'Inicia el tràmit';

export const START_TRAMIT_SCRIPT = `
  (function() {
    const startTramit = () => {
      const buttons = window.document.querySelectorAll(
        'button[type="button"][rel="nofollow"]',
      );

      for (var index = 0; index < buttons.length; index += 1) {
        var button = buttons[index];
        if (button.textContent.trim() === ${JSON.stringify(START_TRAMIT_LABEL)}) {
          button.click();
          return true;
        }
      }

      return false;
    };

    if (!startTramit()) {
      setTimeout(startTramit, 250);
    }
  })();
  true;
`;
