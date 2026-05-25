import {fetchTieSteps} from '@/features/home/services/tieStepsService';

describe('fetchTieSteps', () => {
  it('returns the static Barcelona TIE steps', async () => {
    const steps = await fetchTieSteps();

    expect(steps).toHaveLength(6);
    expect(steps[0]?.slug).toBe('empadronamiento');
    expect(steps[5]?.slug).toBe('collect-tie');
  });
});
