import React from 'react'
import renderer, { act } from 'react-test-renderer'

import { afterEach, describe, expect, it, jest } from '@jest/globals'

import { useWebViewInjection } from './useWebViewInjection'

import type {
  WebViewInjectionHandle,
  UseWebViewInjectionResult,
} from './useWebViewInjection';
import type {WebViewInjectionRule} from './scriptRegistry';

describe('useWebViewInjection', () => {
  const readyRule: WebViewInjectionRule = {
    id: 'matching-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/match',
    },
    script: 'matching-script',
    ready: {
      selector: '#ready',
      timeoutMs: 250,
      pollIntervalMs: 100,
    },
  };

  const secondReadyRule: WebViewInjectionRule = {
    id: 'second-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/other',
    },
    script: 'second-script',
    ready: {
      selector: '#other-ready',
      timeoutMs: 250,
      pollIntervalMs: 100,
    },
  };

  const immediateRule: WebViewInjectionRule = {
    id: 'immediate-rule',
    match: {
      type: 'exact',
      value: 'https://example.com/immediate',
    },
    script: 'immediate-script',
  };

  const renderHook = (
    webViewRef: React.RefObject<WebViewInjectionHandle | null>,
    initialUrl: string,
    rules: WebViewInjectionRule[],
  ) => {
    let currentHookState: UseWebViewInjectionResult | null = null;

    const Harness = () => {
      currentHookState = useWebViewInjection(webViewRef, {
        initialUrl,
        rules,
      });

      return null;
    };

    act(() => {
      renderer.create(<Harness />);
    });

    if (!currentHookState) {
      throw new Error('Hook state not initialized');
    }

    return () => {
      if (!currentHookState) {
        throw new Error('Hook state not initialized');
      }

      return currentHookState;
    };
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('updates the active script when the url changes', () => {
    const getHookState = renderHook(
      {current: null} as React.RefObject<WebViewInjectionHandle | null>,
      'https://example.com/start',
      [readyRule],
    );

    expect(getHookState().currentUrl).toBe('https://example.com/start');
    expect(getHookState().activeScript).toBeNull();

    act(() => {
      getHookState().onNavigationStateChange({
        url: 'https://example.com/match',
      });
    });

    expect(getHookState().currentUrl).toBe('https://example.com/match');
    expect(getHookState().activeScript).toBe('matching-script');
  });

  it('waits for the ready selector before injecting the page script', () => {
    jest.useFakeTimers();
    const injectJavaScript = jest.fn();
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/match',
      [readyRule],
    );

    act(() => {
      getHookState().onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(1);
    expect(injectJavaScript.mock.calls[0][0]).toContain(
      'window.document.querySelector("#ready")',
    );
    expect(injectJavaScript).not.toHaveBeenCalledWith('matching-script');
  });

  it('injects the page script after a selector-ready message arrives', () => {
    jest.useFakeTimers();
    const injectJavaScript = jest.fn();
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/match',
      [readyRule],
    );

    act(() => {
      getHookState().onLoadEnd();
    });

    act(() => {
      expect(
        getHookState().handleMessage(
          JSON.stringify({
            __webViewInjection: true,
            type: 'ready-state',
            payload: {
              ready: true,
              ruleId: 'matching-rule',
              url: 'https://example.com/match',
              selector: '#ready',
            },
          }),
        ),
      ).toBe(true);
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(2);
    expect(injectJavaScript).toHaveBeenLastCalledWith('matching-script');
  });

  it('resets pending readiness state when the url changes', () => {
    jest.useFakeTimers();
    const injectJavaScript = jest.fn();
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/match',
      [readyRule, secondReadyRule],
    );

    act(() => {
      getHookState().onLoadEnd();
    });

    act(() => {
      getHookState().onNavigationStateChange({
        url: 'https://example.com/other',
      });
    });

    act(() => {
      expect(
        getHookState().handleMessage(
          JSON.stringify({
            __webViewInjection: true,
            type: 'ready-state',
            payload: {
              ready: true,
              ruleId: 'matching-rule',
              url: 'https://example.com/match',
              selector: '#ready',
            },
          }),
        ),
      ).toBe(true);
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(1);
    expect(injectJavaScript).not.toHaveBeenCalledWith('matching-script');

    act(() => {
      getHookState().onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(2);
    expect(injectJavaScript.mock.calls[1][0]).toContain(
      'window.document.querySelector("#other-ready")',
    );
  });

  it('does not double-inject on duplicate load end events', () => {
    jest.useFakeTimers();
    const injectJavaScript = jest.fn();
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/match',
      [readyRule],
    );

    act(() => {
      getHookState().onLoadEnd();
      getHookState().onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(1);

    act(() => {
      getHookState().handleMessage(
        JSON.stringify({
          __webViewInjection: true,
          type: 'ready-state',
          payload: {
            ready: true,
            ruleId: 'matching-rule',
            url: 'https://example.com/match',
            selector: '#ready',
          },
        }),
      );
      getHookState().onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(2);
    expect(injectJavaScript).toHaveBeenLastCalledWith('matching-script');
  });

  it('logs and skips injection when readiness polling times out', () => {
    jest.useFakeTimers();
    const injectJavaScript = jest.fn();
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/match',
      [readyRule],
    );

    act(() => {
      getHookState().onLoadEnd();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(3);
    expect(injectJavaScript).not.toHaveBeenCalledWith('matching-script');
    expect(debugSpy).toHaveBeenCalledWith(
      '[WebViewInjection] Readiness timed out',
      {
        currentUrl: 'https://example.com/match',
        ruleId: 'matching-rule',
        selector: '#ready',
        timeoutMs: 250,
      },
    );
  });

  it('injects immediately when a matching rule has no readiness config', () => {
    const injectJavaScript = jest.fn();
    const getHookState = renderHook(
      {
        current: {
          injectJavaScript,
        },
      } as React.RefObject<WebViewInjectionHandle>,
      'https://example.com/immediate',
      [immediateRule],
    );

    act(() => {
      getHookState().onLoadEnd();
    });

    expect(injectJavaScript).toHaveBeenCalledTimes(1);
    expect(injectJavaScript).toHaveBeenCalledWith('immediate-script');
  });
});
