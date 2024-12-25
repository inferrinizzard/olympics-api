import latinize from 'latinize';

import gamesDetail from '@/json/final/gamesDetail.json';

export const convertGamesKey = (rawGamesKey: string) => {
  const [host_year, edition] = rawGamesKey.split('_');
  const host_year_slugs = host_year.split('-');
  const year = host_year_slugs.pop();
  const host = host_year_slugs.join('');

  // Turin <-> Torino

  return gamesDetail.find(
    (games) =>
      games.year === year &&
      latinize(games.host).toLowerCase().replace(/[^\w]/g, '').includes(host) &&
      games.edition.includes(edition.slice(0, -1))
  )?.code;
};
