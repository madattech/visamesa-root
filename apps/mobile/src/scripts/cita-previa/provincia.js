export const PROVINCIA_URL =
  'https://icp.administracionelectronica.gob.es/icpplus/index.html';

export const buildProvinciaScript = provinceOptionIndex => `
  (function() {
    const trySelectProvince = (attempt = 1) => {
      const dropdown =
        window.document.querySelector('select#form') ||
        window.document.querySelector('#form') ||
        window.document.querySelector('select[name="form"]');
      const targetOption = dropdown?.options?.[${provinceOptionIndex}];

      if (dropdown && targetOption) {
        dropdown.value = targetOption.value;
        targetOption.selected = true;
        dropdown.dispatchEvent(new Event('input', {bubbles: true}));
        dropdown.dispatchEvent(new Event('change', {bubbles: true}));

        const acceptButton = window.document.querySelector('#btnAceptar');
        if (acceptButton) {
          acceptButton.click();
        }
        return;
      }

      if (attempt < 12) {
        setTimeout(() => trySelectProvince(attempt + 1), 250);
      }
    };

    trySelectProvince();
  })();
  true;
`;
