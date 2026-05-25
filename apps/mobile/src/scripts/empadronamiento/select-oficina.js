export const SELECT_OFICINA_SCRIPT = `
  (function() {
    const submit = () => {
      document.querySelector('button[type="submit"]').click();
    };
    const selectOffice = () => {
      document.querySelector('#OAC-DR')?.click();
      submit();
    };

    selectOffice();
  })();
  true;
`;
