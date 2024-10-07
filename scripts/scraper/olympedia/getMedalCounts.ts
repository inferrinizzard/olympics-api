import { writeFileSync } from 'node:fs';

import countsJson from '@/json/partial/olympedia/counts.json';

import { delay } from '../utils/delay';
import { getDocument } from '../utils/getDocument';
import { tryParseInt } from './utils';

const MEDAL_COUNT_PAGE_TEMPLATE =
  'https://www.olympedia.org/editions/${i}/sports/${sport}';

/**
 * Gets number of athletes, male and female for each sport from each NOC for each games
 */
const getMedalCountsForGamesPages = async (document: Document) => {
  const medalHeader = [...document.getElementsByTagName('h2')].find((h2) =>
    h2.textContent?.toLowerCase().includes('medal table')
  );

  if (!medalHeader) {
    return;
  }

  let medalCountTable = medalHeader.nextElementSibling;

  while (medalCountTable?.tagName !== 'TABLE') {
    if (!medalCountTable) {
      return;
    }
    medalCountTable = medalCountTable?.nextElementSibling;
  }

  const medalCounts: Record<
    string,
    { gold: number; silver: number; bronze: number }
  > = {};

  for (const row of [...(medalCountTable as HTMLTableElement).rows].slice(1)) {
    const country = row.cells[1].textContent?.trim();
    if (!country) {
      continue;
    }

    medalCounts[country] = {
      gold: tryParseInt(row.cells[2].textContent ?? ''),
      silver: tryParseInt(row.cells[3].textContent ?? ''),
      bronze: tryParseInt(row.cells[4].textContent ?? ''),
    };
  }

  return medalCounts;
};

const getGamesMedalsPages = async () => {
  const data = [...countsJson] as { i: number; counts: Record<string, any> }[];
  const promises = countsJson.map(async (gamesRow, j) => {
    for (const sport of gamesRow.sportsList) {
      await delay(500);
      const url = MEDAL_COUNT_PAGE_TEMPLATE.replace(
        '${i}',
        gamesRow.i.toString()
      ).replace('${sport}', sport);

      const document = await getDocument(url);

      if (typeof document === 'number') {
        console.log(
          `Received status code: ${document} for index {${gamesRow.i}}, sport {${sport}} at ${url}, skipping.`
        );
        continue;
      }

      const medalCountData = await getMedalCountsForGamesPages(document);

      if (!medalCountData) {
        console.log(
          `No medal data for index {${gamesRow.i}}, sport {${sport}}.`
        );
        continue;
      }

      for (const [country, medalCounts] of Object.entries(medalCountData)) {
        data[j].counts[sport][country] = {
          ...data[j].counts[sport][country],
          ...medalCounts,
        };
      }
    }
  });

  await Promise.allSettled(promises);

  return data;
};

const OLYMPEDIA_COUNTS_FINAL_PATH = './json/final/participationRecords.json';

const totalCountData = await getGamesMedalsPages();
writeFileSync(
  OLYMPEDIA_COUNTS_FINAL_PATH,
  JSON.stringify(totalCountData, null, 2)
);
