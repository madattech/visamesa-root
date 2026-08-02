import {isAxiosError} from 'axios';

import {
  buildAxiosErrorContext,
  reportClientError,
  reportClientErrorFromException,
  sanitizeUrlForReport,
  toNumericContextValue,
} from '@/services/clientErrorService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn().mockResolvedValue({data: {report: {id: 'report-1'}}}),
  },
}));

describe('clientErrorService', () => {
  it('sanitizes URLs without query strings', () => {
    expect(
      sanitizeUrlForReport(
        'https://sede.administracionespublicas.gob.es/path/to/page?token=secret',
      ),
    ).toBe('sede.administracionespublicas.gob.es/path/to/page');
  });

  it('builds context from generic errors', () => {
    expect(buildAxiosErrorContext(new Error('boom'))).toEqual({
      message: 'boom',
    });
  });

  it('builds context from axios errors', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 500',
      response: {status: 500},
      config: {method: 'put'},
    };

    if (!isAxiosError(error)) {
      throw new Error('Expected axios-like error in test');
    }

    expect(buildAxiosErrorContext(error)).toEqual({
      statusCode: 500,
      networkError: false,
      method: 'put',
    });
  });

  it('reports without throwing when unauthenticated', async () => {
    await expect(
      Promise.resolve(reportClientError('PROGRESS_SYNC_FAILED', {stepId: 2})),
    ).resolves.toBeUndefined();
  });

  it('merges exception context in reportClientErrorFromException', () => {
    expect(() =>
      reportClientErrorFromException(
        'PROFILE_FETCH_FAILED',
        new Error('boom'),
        {screen: 'Profile'},
      ),
    ).not.toThrow();
  });

  it('normalizes numeric context values', () => {
    expect(toNumericContextValue(404)).toBe(404);
    expect(toNumericContextValue('404')).toBeNull();
  });
});
