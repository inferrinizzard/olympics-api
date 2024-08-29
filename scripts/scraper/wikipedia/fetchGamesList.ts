import { JSDOM } from 'jsdom';
import latinize from 'latinize';

import Wikipedia from './wikipedia-api';

const parseUtils = {
  findColThWithText: (text: RegExp | string) => (node: HTMLElement) =>
    node.querySelector('th[scope="col"]')?.textContent?.match(text),

  findRowThWithText: (text: RegExp | string) => (node: HTMLElement) =>
    [...(node.querySelectorAll('th[scope="row"]') ?? [])].find((th) =>
      th.textContent?.match(text)
    ),
} as const;

const extractOlympicsTemplateTableRows = async (): Promise<
  HTMLTableRowElement[]
> => {
  const olympicsTemplateUrl =
    'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template%3AOlympic_Games&prop=text&disabletoc=1&formatversion=2';

  const olympicsResponse = await Wikipedia.getPageHtml(olympicsTemplateUrl);

  const document = new JSDOM(olympicsResponse).window.document;

  const allRows = [...document.getElementsByTagName('tr')];
  const subTables = allRows.filter(
    (row) => row.getElementsByTagName('table').length
  );

  const olympicsGamesTable = subTables
    .find(parseUtils.findColThWithText(/^olympic games$/i))
    ?.querySelector('table');

  if (!olympicsGamesTable) {
    console.log('Olympics Table not found, did the DOM tree change ?');
    return [];
  }

  const summerOlympicsRow = [
    ...olympicsGamesTable.getElementsByTagName('tr'),
  ].find(parseUtils.findRowThWithText(/summer/i));
  const winterOlympicsRow = [
    ...olympicsGamesTable.getElementsByTagName('tr'),
  ].find(parseUtils.findRowThWithText(/winter/i));

  const yogTable = subTables
    .find(parseUtils.findColThWithText(/youth/i))
    ?.querySelector('table');
  if (!yogTable) {
    console.log('YOG Table not found, did the DOM tree change ?');
    return [];
  }

  const summerYogRow = [...yogTable.getElementsByTagName('tr')].find(
    parseUtils.findRowThWithText(/summer/i)
  );
  const winterYogRow = [...yogTable.getElementsByTagName('tr')].find(
    parseUtils.findRowThWithText(/winter/i)
  );

  return [
    summerOlympicsRow,
    winterOlympicsRow,
    summerYogRow,
    winterYogRow,
  ].filter((row) => !!row);
};

const extractParalympicsTemplateTableRows = async (): Promise<
  HTMLTableRowElement[]
> => {
  const paralympicsTemplateUrl =
    'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template%3AParalympic_Games&prop=text&disabletoc=1&formatversion=2';

  const paralympicsResponse = await Wikipedia.getPageHtml(
    paralympicsTemplateUrl
  );

  const document = new JSDOM(paralympicsResponse).window.document;

  const allTables = [...document.getElementsByTagName('table')];

  const paralympicGamesTable = allTables.find(
    parseUtils.findColThWithText(/paralympic games/i)
  );
  if (!paralympicGamesTable) {
    console.log('Paralympic Table not found, did the DOM tree change ?');
    return [];
  }

  const summerParalympicRow = [
    ...paralympicGamesTable.getElementsByTagName('tr'),
  ].find(parseUtils.findRowThWithText(/summer/i));
  const winterParalympicRow = [
    ...paralympicGamesTable.getElementsByTagName('tr'),
  ].find(parseUtils.findRowThWithText(/winter/i));

  return [summerParalympicRow, winterParalympicRow].filter((row) => !!row);
};

const processRows = (...rowElements: HTMLTableRowElement[]) => {
  const gamesList = [];

  for (const rowElement of rowElements) {
    const gamesAnchors = [...rowElement.getElementsByTagName('a')].filter(
      (el) => el.textContent?.match(/^[0-9]{4}.+/)
    );

    for (const anchor of gamesAnchors) {
      const currentText = anchor.textContent!;

      // const year = currentText.match(/^[0-9]{4}/)?.[0];
      const host = currentText.slice(4).trim();

      const title = anchor.getAttribute('title')!;

      const [year, season, edition, ...rest] = title.toLowerCase().split(' ');

      const pageName = anchor
        .getAttribute('href')!
        .replace(/wiki/, '')
        .replace(/[/]/g, '');

      const cleanHost = latinize(host)
        .toLowerCase()
        .replaceAll(/\p{Dash}/gu, '=')
        .replaceAll(/\s?[/]\s?/g, '+')
        .replaceAll(/[^'+=\s\d\w]/g, '')
        .replaceAll(/[\s']/g, '-');
      const code = `${year}_${cleanHost}`;

      gamesList.push({ code, year, host, season, edition, pageName });
    }
  }

  return gamesList;
};

export const fetchGamesList = async () => {
  const olympicsRows = await extractOlympicsTemplateTableRows();
  const paralympicsRows = await extractParalympicsTemplateTableRows();
  const gamesList = processRows(...olympicsRows, ...paralympicsRows);

  return gamesList;
};
