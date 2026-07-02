export const EMPADRONAMIENTO_SEARCH_RESULT_PATH = '/search-result';

export const EMPADRONAMIENTO_SEARCH_RESULT_URL =
  'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/search-result?idCategory=21';

const TARGET_TEXT = "Cita amb les Oficines d'Atenció Ciutadana";

export const OSC_SELECT_SCRIPT = `
  (function() {
    const targetText = ${JSON.stringify(TARGET_TEXT)};
    const normalize = value => (value || '').replace(/\\s+/g, ' ').trim();

    const findClickable = () => {
      const tramitLinks = Array.from(
        document.querySelectorAll('a[href*="/tramit/"]'),
      );
      const targetTramitLink = tramitLinks.find(link =>
        normalize(link.closest('article, li, div, section')?.textContent).includes(
          targetText,
        ),
      );

      if (targetTramitLink) {
        return targetTramitLink;
      }

      const target = Array.from(
        document.querySelectorAll('p, a, button, [role="button"]'),
      ).find(element => normalize(element.textContent).includes(targetText));

      return (
        target?.closest('a, button, [role="button"]') ||
        target?.parentElement?.closest('a, button, [role="button"]') ||
        target ||
        (tramitLinks.length === 1 ? tramitLinks[0] : null)
      );
    };

    const clickWhenReady = () => {
      const clickable = findClickable();
      if (!clickable) {
        return false;
      }

      clickable.click();
      return true;
    };

    if (clickWhenReady()) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (clickWhenReady()) {
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  })();
  true;
`;
