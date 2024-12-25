export const tryParseInt = (str: string) => {
  const numOrNan = Number.parseInt(str ?? '');
  return Number.isNaN(numOrNan) ? 0 : numOrNan;
};
