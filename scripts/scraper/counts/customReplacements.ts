export const replaceCountryCode = (code: string) => {
  if (code.toUpperCase() === 'WIF') {
    return 'BWI';
  }

  return code;
};

export const replaceSportCode = (code: string) => {
  // Rugby union
  if (code.toUpperCase() === 'RGB') {
    return 'RUG';
  }

  // Softball
  if (code.toUpperCase() === 'SOF') {
    return 'SBL';
  }

  // Beach Handball
  if (code.toUpperCase() === 'BHA') {
    return 'HBB';
  }

  // Futsal
  if (code.toUpperCase() === 'FTS') {
    return 'FBS';
  }

  return code;
};
