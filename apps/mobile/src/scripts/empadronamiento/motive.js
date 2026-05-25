export const buildMotiveScript = (motive = '') => {
  const motiveText = JSON.stringify(motive);

  return `
    (function() {
      const fillMotive = () => {
        const motivo = document.querySelector(
          'textarea#motivo[name="motivo"][aria-label="motivo"]',
        );

        motivo.value = ${motiveText};

        motivo.dispatchEvent(new Event('input', { bubbles: true }));
        motivo.dispatchEvent(new Event('change', { bubbles: true }));

        submit();
      };
      const submit = () => {
        document.querySelector('button[type="submit"]').click();
      };

      fillMotive();
    })();
    true;
  `;
};
