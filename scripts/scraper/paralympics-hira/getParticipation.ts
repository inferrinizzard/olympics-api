import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { delay } from '../utils/delay';
import { getDocument } from '../utils/getDocument';
import { tryParseInt } from '../utils/tryParseInt';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const pemPath = path.resolve(__dirname, './db.ipc-services.org.pem');

const getGamesHiraKeys = async () => {
  const document = await getDocument(
    'https://db.ipc-services.org/hira/paralympics/index',
    pemPath
  );

  if (typeof document === 'number') {
    return [];
  }

  const owlLinkCards = [...document.querySelectorAll('.owl-item')];
  const imageUrls = owlLinkCards.map((card) =>
    card.querySelector('img')?.getAttribute('src')
  );

  const gamesHiraKeys = imageUrls.flatMap(
    (url) => url?.split('/').pop()?.split('.')[0] ?? []
  );

  return gamesHiraKeys;
};

const HIRA_GAMES_PAGE_TEMPLATE =
  'https://db.ipc-services.org/hira/paralympics/competition/code/${games}';

const getGamesDisciplines = async (gamesHiraKey: string) => {
  const url = HIRA_GAMES_PAGE_TEMPLATE.replace('${games', gamesHiraKey);
  const document = await getDocument(url, pemPath);

  if (typeof document === 'number') {
    return [];
  }

  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (!dropdownMenu) {
    return [];
  }

  const disciplineUrls = [...dropdownMenu.querySelectorAll('a.dropdown-item')]
    .map((item) => item.getAttribute('href'))
    .filter((url) => !url?.includes('discipline'));

  const disciplineCodes = disciplineUrls.flatMap(
    (url) => url?.split('/').pop() ?? []
  );

  return disciplineCodes;
};

const HIRA_GAMES_ATHLETES_PAGE_TEMPLATE =
  'https://db.ipc-services.org/hira/paralympics/participants/code/${games}/discipline/${discipline}';

const getAthleteCounts = async (games: string, discipline: string) => {
  const url = HIRA_GAMES_ATHLETES_PAGE_TEMPLATE.replace(
    '${games}',
    games
  ).replace('${discipline}', discipline);

  const document = await getDocument(url, pemPath);

  if (typeof document === 'number') {
    console.log(
      `Failed getting athletes document for ${games}.${discipline}, skipping.`
    );
    return;
  }

  const athleteCountTable = document.querySelector('table');

  if (!athleteCountTable) {
    console.log(
      `Can't find athletes count table for ${games}.${discipline}, skipping.`
    );
    return;
  }

  const athleteCounts: Record<string, { men: number; women: number }> = {};

  for (const row of [...athleteCountTable.rows].slice(1, -1)) {
    const country = row.cells[1].textContent?.trim() ?? '';

    if (!country) {
      continue;
    }

    const counts = {
      men: tryParseInt(row.cells[2].textContent ?? ''),
      women: tryParseInt(row.cells[3].textContent ?? ''),
    };

    athleteCounts[country] = counts;
  }

  return athleteCounts;
};

const HIRA_GAMES_MEDALS_PAGE_TEMPLATE =
  'https://db.ipc-services.org/hira/paralympics/medal-standings/code/${games}/discipline/${discipline}';

const getMedalCounts = async (games: string, discipline: string) => {
  const url = HIRA_GAMES_MEDALS_PAGE_TEMPLATE.replace(
    '${games}',
    games
  ).replace('${discipline}', discipline);

  const document = await getDocument(url, pemPath);

  if (typeof document === 'number') {
    console.log(
      `Failed getting medals document for ${games}.${discipline}, skipping.`
    );
    return;
  }

  const medalCountsTable = document.querySelector('table');

  if (!medalCountsTable) {
    console.log(
      `Can't find medals count table for ${games}.${discipline}, skipping.`
    );
    return;
  }

  const medalCounts: Record<
    string,
    { gold: number; silver: number; bronze: number }
  > = {};

  for (const row of [...medalCountsTable.rows].slice(1, -1)) {
    const country = row.cells[1].textContent?.trim() ?? '';

    if (!country) {
      continue;
    }

    const counts = {
      gold: tryParseInt(row.cells[2].textContent ?? ''),
      silver: tryParseInt(row.cells[3].textContent ?? ''),
      bronze: tryParseInt(row.cells[4].textContent ?? ''),
    };

    medalCounts[country] = counts;
  }

  return medalCounts;
};

const getCounts = async () => {
  const gamesHiraKeys = await getGamesHiraKeys();

  const counts: Record<string, any> = {};

  for (const gamesHiraKey of gamesHiraKeys) {
    await delay(500);
    const disciplines = await getGamesDisciplines(gamesHiraKey);

    const gamesCounts: Record<string, any> = {};

    for (const discipline of disciplines) {
      await delay(500);
      const athleteCounts = await getAthleteCounts(gamesHiraKey, discipline);
      const medalCounts = await getMedalCounts(gamesHiraKey, discipline);

      const disciplineCounts: Record<
        string,
        Record<string, number>
      > = athleteCounts ?? {};

      for (const [country, medals] of Object.entries(medalCounts ?? {})) {
        disciplineCounts[country] = { ...disciplineCounts[country], ...medals };
      }

      gamesCounts[discipline] = disciplineCounts;
      break;
    }

    counts[gamesHiraKey] = gamesCounts;
    break;
  }

  return counts;
};

await getDocument(
  'https://db.ipc-services.org/hira/paralympics/index',
  pemPath
);

// const counts = await getCounts();

// console.log(JSON.stringify(counts));
