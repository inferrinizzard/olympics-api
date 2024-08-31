import wiki from 'wikipedia';
import { JSDOM } from 'jsdom';
import anyDateParser from 'any-date-parser';

import type { PartialGamesList } from '../../../src/models';

const getInfoboxElement = (html: string) => {
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

const dateProcessor = (value: string, year: number) => {
  try {
    const parsedDate = anyDateParser.attempt(value);
    const date = new Date();
    date.setFullYear(year, parsedDate.month, parsedDate.day);
    return date.toISOString().split('T')[0];
  } catch {
    return value;
  }
};

const extractMottoFromInfoBox = (infobox: HTMLTableElement) => {
  const mottoRow = [...infobox.rows].find(
    (row) => row.cells[0].textContent?.toLowerCase() === 'motto'
  );

  const mottoValueCell = mottoRow?.cells[1];
  const mottoText = [
    ...(mottoValueCell?.querySelectorAll('span[lang]') || []),
    ...(mottoValueCell?.getElementsByTagName('i') || []),
  ].flatMap((element) => element.textContent ?? []);

  return mottoText.length ? mottoText : undefined;
};

export const readGamesInfoBoxFromPage = async (games: PartialGamesList) => {
  const gamesPage = await wiki.page(games.pageName, {
    preload: true,
    fields: ['infobox', 'images', 'html'],
  });
  const gamesInfobox = gamesPage._infobox;
  const gamesInfoBoxElement = getInfoboxElement(gamesPage._html);

  const image = gamesPage._images.find(
    (image) => image.title.includes('logo') || image.title.includes('poster')
  )?.url;
  const motto = extractMottoFromInfoBox(gamesInfoBoxElement);

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
