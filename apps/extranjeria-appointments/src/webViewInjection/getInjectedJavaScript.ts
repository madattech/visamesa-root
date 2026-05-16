export const ICP_PLUS_URL =
  'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus';

const ICP_PLUS_SCRIPT = `
  (function() {
    const currentUrl = window.location.href;

    switch (currentUrl) {
      case "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus": {
        const submitButton = window.document.querySelector('#submit');
        if (submitButton) {
          submitButton.click();
        }
        break;
      }
      default:
        break;
    }
  })();
  true;
`;

export const getInjectedJavaScript = (
  currentUrl: string | null | undefined,
) => {
  switch (currentUrl) {
    case ICP_PLUS_URL:
      return ICP_PLUS_SCRIPT;
    default:
      return null;
  }
};
