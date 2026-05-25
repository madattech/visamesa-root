export const TEMA_SCRIPT = `
  (function() {
    const tema = () => {
      const select = document.querySelector(
        'select[aria-label="tema"][name="tematicas"]',
      );
      const option = [...select.options].find(
        o => o.textContent.trim() === "OAC: ATENCIÓ PRESENCIAL A L'OFICINA",
      );

      select.value = option.value;

      select.dispatchEvent(
        new Event('input', {
          bubbles: true,
        }),
      );
      select.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
    };
    const subTema = () => {
      const subtemaselect = document.querySelector('select[name="subtematicas"]');
      subtemaselect.value = 'OAPAD';
      subtemaselect.dispatchEvent(
        new Event('input', {
          bubbles: true,
        }),
      );
      subtemaselect.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
    };
    const submit = () => {
      document.querySelector('button[type="submit"]').click();
    };

    const closeModal = () => {
      const modal = window.document.querySelector('[aria-modal="true"]');
      const closeTarget = modal?.querySelector('p[tabindex="0"]');
      closeTarget?.click();
    };
    const tramit = async () => {
      tema();
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      await delay(4000);
      subTema();
      await delay(3000);
      submit();
      await delay(3000);
      closeModal();
    };
    tramit();
  })();
  true;
`;
