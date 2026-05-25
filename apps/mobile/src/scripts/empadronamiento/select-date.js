export const SELECT_DATE_SCRIPT = `
  (function() {
    function nextWeekday(from = new Date()) {
      const d = new Date(from);
      d.setHours(0, 0, 0, 0);

      const day = d.getDay();

      if (day === 5) d.setDate(d.getDate() + 3);
      else if (day === 6) d.setDate(d.getDate() + 2);
      else d.setDate(d.getDate() + 1);

      return d;
    }
    const submit = () => {
      document.querySelector('button[type="submit"]').click();
    };

    const monthsCa = {
      gener: 0,
      febrer: 1,
      març: 2,
      abril: 3,
      maig: 4,
      juny: 5,
      juliol: 6,
      agost: 7,
      setembre: 8,
      octubre: 9,
      novembre: 10,
      desembre: 11,
    };

    function parseCatalanDate(label) {
      const match = label.match(/^(\\d{1,2}) de (\\w+) del (\\d{4})$/);
      if (!match) return null;

      const [, day, monthName, year] = match;

      return new Date(Number(year), monthsCa[monthName.toLowerCase()], Number(day));
    }

    function pickFirstAvailableDate() {
      const minDate = nextWeekday();

      const cells = [
        ...document.querySelectorAll('mat-calendar td[role="button"][aria-label]'),
      ];

      const availableCells = cells
        .filter(cell => !cell.className.includes('disabled-date'))
        .map(cell => ({
          cell,
          date: parseCatalanDate(cell.getAttribute('aria-label')),
        }))
        .filter(item => item.date && item.date >= minDate)
        .sort((a, b) => a.date - b.date);

      if (!availableCells.length) {
        console.log('No available date found');
        return false;
      }

      availableCells[0].cell.click();
      submit();
      return true;
    }

    pickFirstAvailableDate();
  })();
  true;
`;
