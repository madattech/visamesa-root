import {notifyUnauthorized, onUnauthorized} from './authSession';

describe('authSession', () => {
  it('notifies subscribed listeners when unauthorized', () => {
    const listener = jest.fn();
    const unsubscribe = onUnauthorized(listener);

    notifyUnauthorized();

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    notifyUnauthorized();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
