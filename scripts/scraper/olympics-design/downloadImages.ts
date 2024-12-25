import { existsSync, mkdirSync } from 'node:fs';

import pictogramLinks from '@/json/partial/olympicDesignSportsPictograms.json';

import { matchSportNameToCode } from '../utils/matchSportNameToCode';
import { downloadFile } from '../utils/downloadFile';
import { delay } from '../utils/delay';
import { convertGamesKey } from './utils/convertGamesKey';

for (const [rawGames, map] of Object.entries(pictogramLinks)) {
  const games = convertGamesKey(rawGames);
  console.log('STARTING:', games);
  if (!existsSync(`./images/games/${games}/sports`)) {
    mkdirSync(`./images/games/${games}/sports`);
  }

  for (const [rawSport, rawLink] of Object.entries(map.known)) {
    const sportCode = matchSportNameToCode(rawSport);

    const name = sportCode
      ? `${sportCode}.png`
      : `${rawSport.replace(/[^\w]/g, '_')}.png`;

    // if (!sportCode) {
    //   console.log('UNKNOWN KEY:', `${games}.${rawSport}`);
    // }

    if (existsSync(`./images/games/${games}/sports/${name}`)) {
      continue;
    }

    try {
      if (!rawLink) {
        console.log('SKIPPING', rawGames, rawSport);
        continue;
      }
      const link = rawLink.replace(/dimension=\d+/, 'dimension=1000');
      downloadFile(link, `./images/games/${games}/sports/${name}`);
    } catch {
      console.log('FAILED', rawGames, rawSport);
      continue;
    }

    await delay(1000);
  }

  map.unknown.forEach((link, i) => {
    try {
      downloadFile(
        link.replace(/dimension=\d+/, 'dimension=1000'),
        `./images/games/${games}/sports/UNKNOWN-${i}.png`
      );
    } catch {
      console.log('FAILED', games, link);
    }
  });
}
