import latinize from 'latinize';

import gamesDetail from '@/json/final/gamesDetail.json';

export const convertGamesKey = (rawGamesKey: string) => {
  const [host_year, edition] = rawGamesKey.split('_');
  const [host, year] = host_year.split('-');

  console.log({ host, year, edition });

  return gamesDetail.find(
    (games) =>
      games.year === year &&
      latinize(games.host).toLowerCase().includes(host) &&
      games.edition.includes(edition.slice(0, -1))
  )?.code;
};
