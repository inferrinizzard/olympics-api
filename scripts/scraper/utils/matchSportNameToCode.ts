import sportsDetail from '@/json/final/sportsDetail.json';

const processedSportDetail = Object.fromEntries(
  sportsDetail.map((sport) => [
    sport.name
      .toLowerCase()
      .replace(/[^\p{Letter}]/gu, '')
      .trim(),
    sport.code,
  ])
);

export const matchSportNameToCode = (sportName: string): string | null => {
  const processedSportName = sportName
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}]/gu, '');

  return processedSportDetail[processedSportName] ?? null;
};
