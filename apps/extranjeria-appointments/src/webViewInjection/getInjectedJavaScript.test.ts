import {getInjectedJavaScript, ICP_PLUS_URL} from './getInjectedJavaScript';

describe('getInjectedJavaScript', () => {
  it('returns the ICP Plus script for the ICP Plus url', () => {
    const script = getInjectedJavaScript(ICP_PLUS_URL);

    expect(script).toContain("querySelector('#submit')");
    expect(script).toContain('switch (currentUrl)');
  });

  it('returns null for unmatched urls', () => {
    expect(getInjectedJavaScript('https://example.com')).toBeNull();
    expect(getInjectedJavaScript(null)).toBeNull();
  });
});
