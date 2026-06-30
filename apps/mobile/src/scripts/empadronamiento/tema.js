export const TEMA_SCRIPT = `
  (function() {
    const chooseOption = (select, predicate) => {
      const option = Array.from(select.options).find(predicate);
      if (!option) {
        return false;
      }

      select.value = option.value;
      option.selected = true;
      select.dispatchEvent(new Event('input', {bubbles: true}));
      select.dispatchEvent(new Event('change', {bubbles: true}));
      select.dispatchEvent(new Event('blur', {bubbles: true}));
      return true;
    };

    const findButtonByText = text =>
      Array.from(document.querySelectorAll('button')).find(button =>
        (button.textContent || '').trim().includes(text),
      );

    const submit = (attempt = 1) => {
      const button =
        document.querySelector('button[type="submit"]') || findButtonByText('Següent');

      if (button && !button.disabled) {
        button.click();
        return;
      }

      if (attempt < 20) {
        setTimeout(() => submit(attempt + 1), 500);
      }
    };

    const completeSolicitStep = () => {
      const solicitud = document.querySelector('#solicitud');
      if (!solicitud || window.__visaMesaEmpadronamientoSolicitSelected) {
        return false;
      }

      window.__visaMesaEmpadronamientoSolicitSelected = true;
      if (!solicitud.checked) {
        solicitud.click();
        solicitud.dispatchEvent(new Event('input', {bubbles: true}));
        solicitud.dispatchEvent(new Event('change', {bubbles: true}));
      }

      setTimeout(submit, 300);
      return true;
    };

    const closeModal = () => {
      const modal = window.document.querySelector('[aria-modal="true"]');
      modal?.querySelector('p[tabindex="0"]')?.click();
    };

    const tryTema = (attempt = 1) => {
      if (completeSolicitStep()) {
        setTimeout(() => tryTema(attempt + 1), 1000);
        return;
      }

      const temaSelect =
        document.querySelector('select[name="tematicas"]') ||
        document.querySelector('select[aria-label="tema"]');

      if (!temaSelect) {
        if (attempt < 40) {
          setTimeout(() => tryTema(attempt + 1), 500);
        }
        return;
      }

      if (
        chooseOption(
          temaSelect,
          option => option.textContent.trim() === "OAC: ATENCIÓ PRESENCIAL A L'OFICINA",
        )
      ) {
        trySubTema();
      }
    };

    const trySubTema = (attempt = 1) => {
      const subtemaSelect = document.querySelector('select[name="subtematicas"]');

      if (!subtemaSelect || subtemaSelect.options.length <= 1) {
        if (attempt < 40) {
          setTimeout(() => trySubTema(attempt + 1), 500);
        }
        return;
      }

      if (
        chooseOption(
          subtemaSelect,
          option => option.value === 'OAPAD' || option.textContent.includes('OAPAD'),
        )
      ) {
        setTimeout(() => {
          submit();
          setTimeout(closeModal, 1500);
        }, 1000);
      }
    };

    tryTema();
  })();
  true;
`;
