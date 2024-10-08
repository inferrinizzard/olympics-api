import { writeFileSync } from 'node:fs';

import { findGamesCode } from '../utils/findGamesCode';
import { getDocument } from '../utils/getDocument';
import { delay } from '../utils/delay';

import { tryParseInt } from '../utils/tryParseInt';

/**
 * Gets number of athletes, male and female for each sport from each NOC for each games
 */
const getAthleteCountsForGamesPage = (document: Document) => {
  // Identify sports, countries
  // log on unknown either for games

  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const sportsList = [...table.rows[0].cells]
    .flatMap((cell) => cell.textContent || [])
    .slice(0, -1);

  const countryList = [...table.rows].flatMap(
    (row) => row.cells[0].textContent || []
  );

  // sport => country => men|women: counts;
  const athleteCounts: Record<
    string,
    Record<string, { men: number; women: number }>
  > = {};

  for (const row of [...table.rows].slice(2, -2)) {
    const country = row.cells[0].textContent;

    if (!country) {
      continue;
    }

    [...row.cells]
      .slice(1, -3)
      .flatMap((cell, i, list) => (i % 2 === 0 ? [[cell, list[i + 1]]] : []))
      .forEach(([leftCell, rightCell], colIndex) => {
        const leftCount = tryParseInt(leftCell.textContent ?? '');
        const rightCount = tryParseInt(rightCell.textContent ?? '');

        if (!leftCount && !rightCount) {
          return;
        }

        const sport = sportsList[colIndex];

        if (!athleteCounts[sport]) {
          athleteCounts[sport] = {};
        }
        athleteCounts[sport][country] = { men: leftCount, women: rightCount };
      });
  }

  return { sportsList, countryList, counts: athleteCounts };
};

const GAMES_COUNT_PAGE_TEMPLATE =
  'https://www.olympedia.org/counts/edition/${i}';
const getGamesPages = async () => {
  const countsData = [];

  let i = 0;
  while (++i) {
    await delay(1000);
    const currentPageUrl = GAMES_COUNT_PAGE_TEMPLATE.replace(
      '${i}',
      i.toString()
    );

    const currentDocument = await getDocument(currentPageUrl);
    if (typeof currentDocument === 'number') {
      console.log(
        `Received status code: ${currentDocument} for index {${i}} at ${currentPageUrl}, skipping.`
      );
      continue;
    }
    const topHeader = [...currentDocument.getElementsByTagName('h1')].find(
      (h1) => h1.textContent?.toLowerCase().includes('athlete count')
    );

    if (!topHeader) {
      console.log(`Header not found for {${i}}`);
      continue;
    }

    if (topHeader.textContent?.toLowerCase()?.match(/ancient|zappas/)) {
      break;
    }

    const gamesName = topHeader.textContent?.split('for')[1].trim();
    const [year, season, edition, ...rest] =
      gamesName?.toLowerCase()?.split(' ') ?? [];

    const games = findGamesCode({ year, season, edition });

    if (!games) {
      console.log(`Unknown games: "${topHeader.textContent}"`);
      continue;
    }

    const counts = getAthleteCountsForGamesPage(currentDocument);

    countsData.push({ i, games: games.code, ...counts });
  }

  return countsData;
};

const OLYMPEDIA_COUNTS_TEMP_PATH = './json/partial/olympedia/counts.json';

const data = await getGamesPages();
writeFileSync(OLYMPEDIA_COUNTS_TEMP_PATH, JSON.stringify(data, null, 2));
