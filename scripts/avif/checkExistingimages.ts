import { readFromCsv } from '@/src/_manual/readFromFile';

import {
  createReadStream,
  existsSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';

const participationRecordsCsv = await readFromCsv('participationRecords');
const gamesSportsMap: Record<string, Record<string, boolean | null>> = {};

participationRecordsCsv.forEach((row, i) => {
  if (!(row.games in gamesSportsMap)) {
    gamesSportsMap[row.games] = {};
  }

  if (!(row.sport in gamesSportsMap[row.games])) {
    gamesSportsMap[row.games][row.sport] = null;
  }
});

const root = 'images/games';
const avifQueue: string[] = [];
const notFound: string[] = [];
const extraQueue = [];

const rootDir = readdirSync(root).filter((gamesDir) => !gamesDir.includes('.'));
for (const games of rootDir) {
  const gamesInner = readdirSync(`${root}/${games}`);
  if (
    !gamesInner.includes('emblem.avif') &&
    !gamesInner.includes('emblem.svg')
  ) {
    const sourceFile = gamesInner.find((file) => file.includes('emblem'));
    if (sourceFile) {
      avifQueue.push(`${root}/${games}/${sourceFile}`);
    }
  }

  if (!gamesInner.includes('sports')) {
    continue;
  }

  for (const sport of Object.keys(gamesSportsMap[games] ?? {})) {
    const avifPath = `${root}/${games}/sports/${sport}.avif`;

    gamesSportsMap[games][sport] = existsSync(avifPath);
    if (!gamesSportsMap[games][sport]) {
      const sourceFile = readdirSync(`${root}/${games}/sports`).find((file) =>
        file.includes(sport)
      );
      if (sourceFile) {
        avifQueue.push(`${root}/${games}/sports/${sourceFile}`);
      } else {
        notFound.push(avifPath);
      }
    }
  }

  for (const file of readdirSync(`${root}/${games}/sports`)) {
    const sport = file.split('.')[0];

    if (!gamesSportsMap[games]) {
      continue;
    }

    if (typeof gamesSportsMap[games][sport] === 'boolean') {
      continue;
    }

    if (gamesSportsMap[games] && !(sport in gamesSportsMap[games])) {
      gamesSportsMap[games][sport] = null;
      extraQueue.push({ games, sport });
    }
  }
}

writeFileSync('./scripts/avif/extraQueue.json', JSON.stringify(extraQueue));
writeFileSync(
  './scripts/avif/avifQueue.json',
  JSON.stringify({ avifQueue, notFound })
);
