import wiki from 'wikipedia';
import anyDateParser from 'any-date-parser';

import type { PartialGamesList } from '@/src/models';
import { extractImageFromInfobox, getInfoboxElement } from './infobox';

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

const dateProcessor = (value: string | { date: Date }, year: number) => {
  let date: Date;
  if (typeof value !== 'string' && 'date' in value) {
    date = value.date;
  } else {
    try {
      const parsedDate = anyDateParser.attempt(value);
      date = new Date();
      date.setFullYear(year, parsedDate.month, parsedDate.day);
    } catch {
      return `FIX:${value}`;
    }
  }
  try {
    return date.toISOString().split('T')[0];
  } catch {
    return `FIX:${JSON.stringify(value)}`;
  }
};

const extractMottoFromInfoBox = (infobox: HTMLTableElement) => {
  const mottoRow = [...infobox.rows].find(
    (row) => row.cells[0].textContent?.toLowerCase() === 'motto'
  );

  const mottoText = mottoRow?.cells[1].textContent;

  return mottoText;
};

export const readGamesInfoBoxFromPage = async (games: PartialGamesList) => {
  const gamesPage = await wiki.page(games.pageName, {
    preload: true,
    fields: ['infobox', 'html'],
  });
  const gamesInfobox = gamesPage._infobox;
  const gamesInfoBoxElement = getInfoboxElement(gamesPage._html);

  const image = extractImageFromInfobox(gamesInfoBoxElement);
  const motto = extractMottoFromInfoBox(gamesInfoBoxElement);

  const numAthletes = extractValue(
    gamesInfobox,
    'athletes',
    'numAthletes',
    (value: string) =>
      value.match(/([0-9,])+/)?.[0]?.replaceAll(/,/g, '') ??
      Number.parseInt(value.replaceAll(/,/g, '')).toString()
  );
  const startDate = extractValue(
    gamesInfobox,
    'opening',
    'startDate',
    (value: string) => dateProcessor(value, +games.year)
  );
  const endDate = extractValue(
    gamesInfobox,
    'closing',
    'endDate',
    (value: string) => dateProcessor(value, +games.year)
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
