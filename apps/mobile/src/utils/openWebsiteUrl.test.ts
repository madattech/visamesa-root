import {Linking} from 'react-native';

import {openWebsiteUrl} from '@/utils/openWebsiteUrl';

describe('openWebsiteUrl', () => {
  it('opens the URL with Linking.openURL', async () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);

    await expect(openWebsiteUrl('http://localhost:5173/pricing')).resolves.toBe(true);
    expect(Linking.openURL).toHaveBeenCalledWith('http://localhost:5173/pricing');
  });

  it('returns false when Linking.openURL throws', async () => {
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('failed'));

    await expect(openWebsiteUrl('http://localhost:5173/privacy')).resolves.toBe(false);
  });
});
