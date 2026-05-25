import {getStepShortLabel} from '@/utils/stepLabel';

describe('getStepShortLabel', () => {
  it('returns the first word of the step title', () => {
    expect(getStepShortLabel('Register Your Address')).toBe('Register');
    expect(getStepShortLabel('Pick Up Your TIE')).toBe('Pick');
  });

  it('returns the full title when it is a single word', () => {
    expect(getStepShortLabel('Empadronamiento')).toBe('Empadronamiento');
  });
});
