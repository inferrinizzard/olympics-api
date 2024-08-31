import wiki from 'wikipedia';
import anyDateParser from 'any-date-parser';

import type { PartialGamesList } from '../../../src/models';

const extractValue = (
  infoboxMap: Record<string, string>,
  rawKey: string,
  key: string,
  processor: (value: string) => string
) => {
  if (!(rawKey in infoboxMap)) {
    return;
  }

  return {
    [key]: processor(infoboxMap[rawKey]),
  };
};

export const readGamesInfoBoxFromPage = async (games: PartialGamesList) => {
  const gamesPage = await wiki.page(games.pageName);
  const gamesInfobox = await gamesPage.infobox();

  const image = gamesInfobox.image;
  const motto = gamesInfobox.motto;

  const numAthletes = extractValue(
    gamesInfobox,
    'athletes',
    'numAthletes',
    (value: string) =>
      value.match(/^([0-9]|(?:,))+/)?.[0]?.replaceAll(/,/g, '') ??
      Number.parseInt(value.replaceAll(/,/g, '')).toString()
  );
  const startDate = extractValue(
    gamesInfobox,
    'opening',
    'startDate',
    (value: string) => {
      const parsedDate = anyDateParser.attempt(value);
      const date = new Date();
      date.setFullYear(games.year, parsedDate.month, parsedDate.day);
      return date.toISOString().split('T')[0];
    }
  );
  const endDate = extractValue(
    gamesInfobox,
    'closing',
    'endDate',
    (value: string) => {
      const parsedDate = anyDateParser.attempt(value);
      const date = new Date();
      date.setFullYear(games.year, parsedDate.month, parsedDate.day);
      return date.toISOString().split('T')[0];
    }
  );

  return {
    ...games,
    image,
    motto,
    ...numAthletes,
    ...startDate,
    ...endDate,
  };
};
