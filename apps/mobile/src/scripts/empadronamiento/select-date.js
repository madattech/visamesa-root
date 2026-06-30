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
      const button =
        document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(button =>
          /següent|continuar/i.test(button.textContent || ''),
        );
      button?.click();
    };

    const months = {
      gener: 0,
      enero: 0,
      febrer: 1,
      febrero: 1,
      març: 2,
      marzo: 2,
      abril: 3,
      maig: 4,
      mayo: 4,
      juny: 5,
      junio: 5,
      juliol: 6,
      julio: 6,
      agost: 7,
      agosto: 7,
      setembre: 8,
      septiembre: 8,
      octubre: 9,
      novembre: 10,
      noviembre: 10,
      desembre: 11,
      diciembre: 11,
    };

    function parseDateLabel(label) {
      const normalized = (label || '')
        .replace(/\\u00a0/g, ' ')
        .replace(/[’']/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();
      const match = normalized.match(
        /(\\d{1,2})\\s+d(?:e)?\\s+([a-zà-ÿ]+)\\s+d(?:e|el)\\s+(\\d{4})/i,
      );
      if (!match) return null;

      const [, day, monthName, year] = match;
      const month = months[monthName];
      if (month === undefined) return null;

      return new Date(Number(year), month, Number(day));
    }

    function isDisabled(cell) {
      const className = String(cell.className || '');
      return (
        className.includes('disabled') ||
        cell.getAttribute('aria-disabled') === 'true'
      );
    }

    function findNextMonthButton() {
      return Array.from(document.querySelectorAll('button')).find(button =>
        /següent|siguiente|next/i.test(button.getAttribute('aria-label') || ''),
      );
    }

    function pickFirstAvailableDate(attempt = 1, monthChanges = 0) {
      const minDate = nextWeekday();
      const cells = [
        ...document.querySelectorAll('mat-calendar td[role="button"][aria-label]'),
      ];

      const availableCells = cells
        .filter(cell => !isDisabled(cell))
        .map(cell => ({
          cell,
          date: parseDateLabel(cell.getAttribute('aria-label')),
        }))
        .filter(item => item.date && item.date >= minDate)
        .sort((a, b) => a.date - b.date);

      if (availableCells.length) {
        availableCells[0].cell.click();
        setTimeout(submit, 500);
        return true;
      }

      const nextMonthButton = findNextMonthButton();
      if (cells.length && nextMonthButton && monthChanges < 6) {
        nextMonthButton.click();
        setTimeout(() => pickFirstAvailableDate(1, monthChanges + 1), 800);
        return false;
      }

      if (attempt < 20) {
        setTimeout(() => pickFirstAvailableDate(attempt + 1, monthChanges), 500);
      }
      return false;
    }

    pickFirstAvailableDate();
  })();
  true;
`;
