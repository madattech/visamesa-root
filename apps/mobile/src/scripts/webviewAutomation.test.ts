import {
  click,
  composeWebViewScript,
  delay,
  selectByValue,
  setField,
  submit,
} from './webviewAutomation';

describe('webview automation script composer', () => {
  it('composes small snippets into one injectable WebView script', () => {
    const script = composeWebViewScript([
      setField('input[name="email"]', 'test@example.com'),
      selectByValue('select[name="type"]', 'PASSAPORT'),
      click('#next'),
      submit(),
    ]);

    expect(script).toContain('const automation =');
    expect(script).toContain(
      'automation.setField("input[name=\\"email\\"]", "test@example.com");',
    );
    expect(script).toContain(
      'automation.selectByValue("select[name=\\"type\\"]", "PASSAPORT");',
    );
    expect(script).toContain('automation.click("#next");');
    expect(script).toContain('automation.submit();');
    expect(script).toContain('true;');
  });

  it('supports async flows without inheritance', () => {
    const script = composeWebViewScript([delay(100), click('#after-delay')], {
      async: true,
    });

    expect(script).toContain('(async function()');
    expect(script).toContain('await automation.delay(100);');
    expect(script).toContain('automation.click("#after-delay");');
  });
});
