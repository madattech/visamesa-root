export const PROVINCIA_URL =
  'https://icp.administracionelectronica.gob.es/icpplus/index.html';

export const buildProvinciaScript = provinceOptionIndex => `
  (function() {
    const postDebug = (stage, payload) => {
      try {
        var bridge = window.ReactNativeWebView;
        if (!bridge || typeof bridge.postMessage !== 'function') {
          return;
        }
        bridge.postMessage(JSON.stringify({
          type: 'debug',
          data: {
            stage,
            ...payload,
          },
        }));
      } catch (error) {
        console.log('[province]', stage, payload, error);
      }
    };

    const trySelectProvince = (attempt = 1) => {
      const dropdown =
        window.document.querySelector('select#form') ||
        window.document.querySelector('#form') ||
        window.document.querySelector('select[name="form"]');

      postDebug('province.dropdown.detected', {
        attempt,
        found: Boolean(dropdown),
        tagName: dropdown?.tagName ?? null,
        id: dropdown?.id ?? null,
        name: dropdown?.name ?? null,
        optionCount: dropdown?.options?.length ?? null,
      });

      if (dropdown?.options?.[${provinceOptionIndex}]) {
        dropdown.options[${provinceOptionIndex}].selected = true;
        postDebug('province.dropdown.selected', {
          attempt,
          optionIndex: ${provinceOptionIndex},
          optionText: dropdown.options[${provinceOptionIndex}].text ?? null,
          optionValue: dropdown.options[${provinceOptionIndex}].value ?? null,
        });

        const acceptButton = window.document.querySelector('#btnAceptar');

        if (acceptButton) {
          acceptButton.click();
          postDebug('province.accept_button.clicked', {attempt});
        } else {
          postDebug('province.accept_button.missing', {
            attempt,
            selector: '#btnAceptar',
          });
        }
        return;
      }

      if (attempt < 12) {
        setTimeout(() => trySelectProvince(attempt + 1), 250);
        return;
      }

      postDebug('province.dropdown.missing', {
        selector: '#form / select#form / select[name="form"]',
        attempts: attempt,
      });
    };

    trySelectProvince();
  })();
  true;
`;
