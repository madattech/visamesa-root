export const OFICINA_URL =
  'https://icp.administracionelectronica.gob.es/icpplustieb/citar?p=8&locale=es';

export const buildOficinaScript = tramitesOptionIndex => `
  (function() {
    const tramites = window.document.querySelector('#tramiteGrupo\\\\[0\\\\]');

    if (tramites?.options?.[${tramitesOptionIndex}]) {
      tramites.options[${tramitesOptionIndex}].selected = true;
    }

    const acceptButton = window.document.querySelector('#btnAceptar');

    if (acceptButton) {
      acceptButton.click();
    }
  })();
  true;
`;
