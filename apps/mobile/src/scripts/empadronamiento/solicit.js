export const SOLICIT_SCRIPT = `
  (function() {
    const selectCita = () => {
      window.document.querySelector('#solicitud').click();
      window.document.querySelector("button[type='submit']").click();
    };
    selectCita();
  })();
  true;
`;
