export const phoneToString = (phone: {
  countryCode?: string;
  number?: string;
}): string => {
  if (phone.countryCode && phone.number) {
    return `+${phone.countryCode} ${phone.number}`;
  }
  return phone.number || '';
};

export const stringToPhone = (
  phoneStr: string,
): {countryCode: string; number: string} | null => {
  if (!phoneStr || typeof phoneStr !== 'string') {
    return null;
  }

  const match = phoneStr.match(/^\+?(\d+)\s+(.+)$/);
  if (match) {
    return {
      countryCode: match[1],
      number: match[2],
    };
  }

  return {
    countryCode: '',
    number: phoneStr.replace(/^\+/, ''),
  };
};
