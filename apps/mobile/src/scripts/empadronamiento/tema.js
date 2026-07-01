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

    const isVisible = element =>
      Boolean(element && (element.offsetParent || element.getClientRects().length));

    const observeUntil = condition => {
      if (condition()) {
        return;
      }

      const observer = new MutationObserver(() => {
        if (condition()) {
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'class', 'aria-disabled'],
      });
    };

    const submitWhenReady = () => {
      observeUntil(() => {
        const button =
          document.querySelector('button[type="submit"]') || findButtonByText('Següent');

        if (!button || button.disabled) {
          return false;
        }

        button.click();
        return true;
      });
    };

    const closeModalWhenPresent = () => {
      observeUntil(() => {
        const modal = window.document.querySelector('[aria-modal="true"]');
        const closeTarget = modal?.querySelector('p[tabindex="0"]');
        if (!closeTarget) {
          return false;
        }

        closeTarget.click();
        return true;
      });
    };

    const selectSubTemaWhenReady = () => {
      observeUntil(() => {
        const subtemaSelect = document.querySelector('select[name="subtematicas"]');

        if (!subtemaSelect || subtemaSelect.options.length <= 1) {
          return false;
        }

        if (
          !chooseOption(
            subtemaSelect,
            option => option.value === 'OAPAD' || option.textContent.includes('OAPAD'),
          )
        ) {
          return false;
        }

        submitWhenReady();
        closeModalWhenPresent();
        return true;
      });
    };

    const selectTemaWhenReady = () => {
      observeUntil(() => {
        const temaSelect =
          document.querySelector('select[name="tematicas"]') ||
          document.querySelector('select[aria-label="tema"]');

        if (!temaSelect || !isVisible(temaSelect)) {
          return false;
        }

        if (
          !chooseOption(
            temaSelect,
            option => option.textContent.trim() === "OAC: ATENCIÓ PRESENCIAL A L'OFICINA",
          )
        ) {
          return false;
        }

        selectSubTemaWhenReady();
        return true;
      });
    };

    const solicitud = document.querySelector('#solicitud');
    if (solicitud && !window.__visaMesaEmpadronamientoSolicitSelected) {
      window.__visaMesaEmpadronamientoSolicitSelected = true;
      if (!solicitud.checked) {
        solicitud.click();
        solicitud.dispatchEvent(new Event('input', {bubbles: true}));
        solicitud.dispatchEvent(new Event('change', {bubbles: true}));
      }

      submitWhenReady();
      selectTemaWhenReady();
      return;
    }

    selectTemaWhenReady();
  })();
  true;
`;
