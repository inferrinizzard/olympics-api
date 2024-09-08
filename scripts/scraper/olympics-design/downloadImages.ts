import { existsSync, mkdirSync } from 'node:fs';

import pictogramLinks from '@/json/partial/olympicDesignSportsPictograms.json';

import { matchSportNameToCode } from '../utils/matchSportNameToCode';
import { downloadFile } from '../utils/downloadFile';
import { delay } from '../utils/delay';
import { convertGamesKey } from './utils/convertGamesKey';

for (const [rawGames, map] of Object.entries(pictogramLinks)) {
  const games = convertGamesKey(rawGames);
  if (!existsSync(`./images/games/${games}/sports`)) {
    mkdirSync(`./images/games/${games}/sports`);
  }

  for (const [rawSport, rawLink] of Object.entries(map.known)) {
    const sportCode = matchSportNameToCode(rawSport);

    const name = sportCode
      ? `${sportCode}.png`
      : `${rawSport.replace(/[^\w]/g, '_')}.png`;

    if (!sportCode) {
      console.log('UNKNOWN KEY:', `${games}.${rawSport}`);
    }

    const link = rawLink.replace(/dimension=\d+/, 'dimension=1000');
    downloadFile(link, `./images/games/${games}/sports/${name}`);

    await delay(1000);
  }

  map.unknown.forEach((link, i) =>
    downloadFile(
      link.replace(/dimension=\d+/, 'dimension=1000'),
      `./images/games/${games}/sports/UNKNOWN-${i}.png`
    )
  );
}
