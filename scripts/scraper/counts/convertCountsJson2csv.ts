import { createWriteStream } from 'node:fs';

import olympicsCountsData from '@/json/final/participationRecordsOlympics.json';
import paralympicsCountsData from '@/json/final/participationRecordsParalympics.json';
import { replaceCountryCode, replaceSportCode } from './customReplacements';

const shouldBeCommented = ([
  games,
  country,
  sport,
  gold,
  silver,
  bronze,
  men,
  women,
]: readonly [
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  number
]) => {
  if (country.toUpperCase() === 'UNK') {
    return true;
  }

  if (
    // from olympedia, mostly DNE elsewhere
    ['MIX', 'ROQ', 'MBO', 'IH3', 'MSP', 'AER', 'CMA', 'JDP'].includes(sport)
  ) {
    return true;
  }

  return false;
};

const keys = [
  'games',
  'country',
  'sport',
  'gold',
  'silver',
  'bronze',
  'men',
  'women',
];

export const PARTICIPATION_RECORDS_CSV_PATH = './csv/participationRecords.csv';

const convertCountsJson2csv = () => {
  const writeStream = createWriteStream(PARTICIPATION_RECORDS_CSV_PATH);

  writeStream.write(keys.join(',') + '\n');

  for (const countsRow of [...olympicsCountsData, ...paralympicsCountsData]) {
    const games = countsRow.games;
    for (const [sport, countryCountsMap] of Object.entries(countsRow.counts)) {
      for (const [country, counts] of Object.entries(countryCountsMap)) {
        const gold: number = counts.gold ?? 0;
        const silver: number = counts.silver ?? 0;
        const bronze: number = counts.bronze ?? 0;
        const men: number = counts.men ?? 0;
        const women: number = counts.women ?? 0;

        const values = [
          games,
          replaceCountryCode(country.slice(0, 3)),
          replaceSportCode(sport),
          gold,
          silver,
          bronze,
          men,
          women,
        ] as const;

        const shouldAddComment = shouldBeCommented(values);

        let text = '';
        if (shouldAddComment) {
          text += '# ';
        }
        text += values.join(',');
        text += '\n';

        writeStream.write(text);
      }
    }
  }

  writeStream.close();
};

convertCountsJson2csv();
