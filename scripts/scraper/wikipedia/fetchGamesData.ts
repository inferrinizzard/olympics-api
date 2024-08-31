import { JSDOM } from 'jsdom';
import anyDateParser from 'any-date-parser';

import type { PartialGamesList } from '../../../src/models';
import Wikipedia from './wikipedia-api';

const getInfobox = (html: string) => {
  const dom = new JSDOM(html);
  const infobox = dom.window.document.querySelector('table.infobox');
  return infobox as HTMLTableElement;
};

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

const extractGamesTitle = (infobox: HTMLTableElement) =>
  infobox.querySelector('caption')?.textContent ?? '';
const extractGamesImageUrl = (infobox: HTMLTableElement) =>
  infobox
    .querySelector('td.infobox-image')
    ?.getElementsByTagName('a')
    .item(0)
    ?.getAttribute('href') ?? '';

const extractInfoboxRowsMap = (infobox: HTMLTableElement) =>
  [...infobox.rows].reduce((map, row) => {
    const key = row.cells[0].textContent?.toLowerCase();
    const value = row.cells[1]?.textContent ?? '';

    if (!key) {
      return map;
    }

    map[key] = value;
    return map;
  }, {} as Record<string, string>);

export const readGamesInfoBoxFromPage = async (games: PartialGamesList) => {
  const gamesPageUrl = Wikipedia.getPageUrl(games.pageName);

  const gamesPageHtml = await Wikipedia.getPageHtml(gamesPageUrl);
  const infoboxElement = getInfobox(gamesPageHtml);
  const infoboxMap = extractInfoboxRowsMap(infoboxElement);

  const title = extractGamesTitle(infoboxElement);
  const image = extractGamesImageUrl(infoboxElement);

  const numAthletes = extractValue(
    infoboxMap,
    'athletes',
    'numAthletes',
    (value: string) =>
      value.match(/^([0-9]|(?:,))+/)?.[0]?.replaceAll(/,/g, '') ??
      Number.parseInt(value.replaceAll(/,/g, '')).toString()
  );
  const startDate = extractValue(
    infoboxMap,
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
    infoboxMap,
    'closing',
    'endDate',
    (value: string) => {
      const parsedDate = anyDateParser.attempt(value);
      const date = new Date();
      date.setFullYear(games.year, parsedDate.month, parsedDate.day);
      return date.toISOString().split('T')[0];
    }
  );

  return { ...games, title, image, ...numAthletes, ...startDate, ...endDate };
};
