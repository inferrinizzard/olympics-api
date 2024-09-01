import { writeFileSync } from 'fs';
import wiki from 'wikipedia';

import gamesList from '../../../json/gamesList.json';

const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export const fetchSportsEventsPageNamesForGames = async () => {
  const gamesSportsLinksMap = {} as Record<string, unknown>;

  for (const games of gamesList) {
    const edition =
      games.edition === 'youth' ? 'Youth Olympics' : capitalize(games.edition);

    const sportsTemplatePageName = `Template:Events at the ${
      games.year
    } ${capitalize(games.season)} ${edition}`;

    try {
      const templatePage = await wiki.page(sportsTemplatePageName, {
        preload: true,
        fields: ['links'],
      });

      gamesSportsLinksMap[games.code] = templatePage._links.filter((link) =>
        link.includes('at the')
      );
    } catch {
      console.log('skip', games.code);
    }
  }

  return gamesSportsLinksMap;
};

const linksMap = await fetchSportsEventsPageNamesForGames();
writeFileSync(
  './json/gamesSportsLinksMap.json',
  JSON.stringify(linksMap, null, 2)
);
