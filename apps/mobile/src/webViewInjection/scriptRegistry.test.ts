import {
  matchesWebViewInjectionRule,
  resolveInjectedJavaScript,
  resolveWebViewInjectionRule,
  type WebViewInjectionRule,
} from './scriptRegistry';

describe('scriptRegistry', () => {
  const exactRule: WebViewInjectionRule = {
    id: 'exact-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/exact',
    },
    script: 'exact-script',
  };

  const prefixRule: WebViewInjectionRule = {
    id: 'prefix-rule',
    match: {
      type: 'prefix',
      value: 'https://example.com/prefix',
    },
    script: 'prefix-script',
  };

  const hostRule: WebViewInjectionRule = {
    id: 'host-rule',
    match: {
      type: 'host',
      value: 'example.com',
    },
    script: 'host-script',
  };

  const regexRule: WebViewInjectionRule = {
    id: 'regex-rule',
    match: {
      type: 'regex',
      value: /\/regex\/\d+$/,
    },
    script: 'regex-script',
  };

  it('matches exact rules', () => {
    expect(
      matchesWebViewInjectionRule('https://example.com/exact', exactRule),
    ).toBe(true);
    expect(
      resolveWebViewInjectionRule('https://example.com/exact', [exactRule]),
    ).toEqual(exactRule);
    expect(
      resolveInjectedJavaScript('https://example.com/exact', [exactRule]),
    ).toBe('exact-script');
  });

  it('matches prefix, host, and regex rules', () => {
    expect(
      matchesWebViewInjectionRule(
        'https://example.com/prefix/path',
        prefixRule,
      ),
    ).toBe(true);
    expect(
      matchesWebViewInjectionRule('https://example.com/anything', hostRule),
    ).toBe(true);
    expect(
      matchesWebViewInjectionRule('https://example.com/regex/123', regexRule),
    ).toBe(true);
  });

  it('returns null when no rule matches', () => {
    expect(
      resolveWebViewInjectionRule('https://example.org/no-match', [
        exactRule,
        prefixRule,
        hostRule,
        regexRule,
      ]),
    ).toBeNull();
    expect(
      resolveInjectedJavaScript('https://example.org/no-match', [
        exactRule,
        prefixRule,
        hostRule,
        regexRule,
      ]),
    ).toBeNull();
  });
});
