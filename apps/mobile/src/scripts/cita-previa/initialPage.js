export const ICP_PLUS_URL =
  'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus';

export const INITIAL_PAGE_SCRIPT = `
  (function() {
    const currentUrl = window.location.href;

    if (
      currentUrl ===
      'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus'
    ) {
      window.document.querySelector('#submit').click();
    }
  })();
  true;
`;
