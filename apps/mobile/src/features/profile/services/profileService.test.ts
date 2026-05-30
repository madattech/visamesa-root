import {getProfile, updateProfile} from '@/features/profile/services/profileService';
import apiClient from '@/services/api';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('profileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the current user profile', async () => {
    const profile = {
      personal: {firstName: 'Ada'},
      billing: null,
      residenceRegistration: null,
    };

    mockedApiClient.get.mockResolvedValue({data: profile});

    await expect(getProfile()).resolves.toEqual(profile);
    expect(mockedApiClient.get).toHaveBeenCalledWith('/users/me/profile');
  });

  it('updates a profile section', async () => {
    const profile = {
      personal: {firstName: 'Ada'},
      billing: null,
      residenceRegistration: null,
    };

    mockedApiClient.patch.mockResolvedValue({data: profile});

    await expect(
      updateProfile('personal', {firstName: 'Ada'}),
    ).resolves.toEqual(profile);

    expect(mockedApiClient.patch).toHaveBeenCalledWith('/users/me/profile', {
      section: 'personal',
      data: {firstName: 'Ada'},
    });
  });
});
