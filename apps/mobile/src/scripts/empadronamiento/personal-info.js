export const buildPersonalInfoScript = (info = {}) => {
  const identifierType = JSON.stringify(info.identifierType ?? 'PASSAPORT');
  const identifier = JSON.stringify(info.identifier ?? '');
  const name = JSON.stringify(info.name ?? '');
  const surname = JSON.stringify(info.surname ?? '');
  const secondSurname = JSON.stringify(info.secondSurname ?? '');
  const email = JSON.stringify(info.email ?? '');
  const phone = JSON.stringify(info.phone ?? '');

  return `
    (function() {
      function setField(selector, value) {
        const el = document.querySelector(selector);
        if (!el) {
          console.warn('Not found:', selector);
          return false;
        }

        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));

        return true;
      }
      const submit = () => {
        document.querySelector('button[type="submit"]').click();
      };
      const fillInfo = () => {
        setField('select[formcontrolname="identifierType"]', ${identifierType});
        setField('input[formcontrolname="identifier"]', ${identifier});
        setField('input[formcontrolname="name"]', ${name});
        setField('input[formcontrolname="surname"]', ${surname});
        setField('input[formcontrolname="secondSurname"]', ${secondSurname});
        setField('input[formcontrolname="email"]', ${email});
        setField('input[formcontrolname="phone"]', ${phone});
        submit();
      };

      fillInfo();
    })();
    true;
  `;
};
