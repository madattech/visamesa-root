import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {useWebViewInjection} from './useWebViewInjection';
import type {
  WebViewInjectionHandle,
  UseWebViewInjectionResult,
} from './useWebViewInjection';
import type {WebViewInjectionRule} from './scriptRegistry';

describe('useWebViewInjection', () => {
  const matchingRule: WebViewInjectionRule = {
    id: 'matching-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/match',
    },
    script: 'matching-script',
  };

  const unmatchedRule: WebViewInjectionRule = {
    id: 'unmatched-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/unmatched',
    },
    script: 'unmatched-script',
  };

  it('updates the active script when the url changes', () => {
    let currentHookState: UseWebViewInjectionResult | null = null;
    const getHookState = () => {
      if (!currentHookState) {
        throw new Error('Hook state not initialized');
      }

      return currentHookState;
    };

    const Harness = () => {
      currentHookState = useWebViewInjection(
        {current: null} as React.RefObject<WebViewInjectionHandle>,
        {
          initialUrl: 'https://example.com/start',
          rules: [matchingRule],
        },
      );

      return null;
    };

    act(() => {
      renderer.create(<Harness />);
    });

    const hookState = getHookState();

    expect(hookState.currentUrl).toBe('https://example.com/start');
    expect(hookState.activeScript).toBeNull();

    act(() => {
      hookState.onNavigationStateChange({
        url: 'https://example.com/match',
      });
    });

    const updatedHookState = getHookState();

    expect(updatedHookState.currentUrl).toBe('https://example.com/match');
    expect(updatedHookState.activeScript).toBe('matching-script');
  });

  it('injects the active script on load end', () => {
    const injectJavaScript = jest.fn();
    const webViewRef = {
      current: {
        injectJavaScript,
      },
    } as React.RefObject<WebViewInjectionHandle>;

    let currentHookState: UseWebViewInjectionResult | null = null;

    const Harness = () => {
      currentHookState = useWebViewInjection(webViewRef, {
        initialUrl: 'https://example.com/match',
        rules: [matchingRule],
      });

      return null;
    };

    act(() => {
      renderer.create(<Harness />);
    });

    act(() => {
      currentHookState?.onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(1);
    expect(injectJavaScript).toHaveBeenCalledWith('matching-script');
  });

  it('does nothing when no rule matches', () => {
    const injectJavaScript = jest.fn();
    const webViewRef = {
      current: {
        injectJavaScript,
      },
    } as React.RefObject<WebViewInjectionHandle>;

    let currentHookState: UseWebViewInjectionResult | null = null;
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {
      // Silence the expected miss log for the test run.
    });

    const Harness = () => {
      currentHookState = useWebViewInjection(webViewRef, {
        initialUrl: 'https://example.org/no-match',
        rules: [unmatchedRule],
      });

      return null;
    };

    act(() => {
      renderer.create(<Harness />);
    });

    act(() => {
      currentHookState?.onLoadEnd();
    });

    expect(injectJavaScript).not.toHaveBeenCalled();
    expect(debugSpy).toHaveBeenCalledWith(
      '[WebViewInjection] No matching rule for current URL',
      {currentUrl: 'https://example.org/no-match'},
    );

    debugSpy.mockRestore();
  });
});
