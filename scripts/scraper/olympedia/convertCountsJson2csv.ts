import { createWriteStream } from 'node:fs';

import countsData from '@/json/final/medalAthleteCounts.json';

const keys = [
  'games',
  'country',
  'sports',
  'gold',
  'silver',
  'bronze',
  'men',
  'women',
];

const GAMES_RECORDS_CSV_PATH = './csv/countsRecords.csv';

const convertCountsJson2csv = () => {
  const writeStream = createWriteStream(GAMES_RECORDS_CSV_PATH);

  writeStream.write(keys.join(',') + '\n');

  for (const countsRow of countsData) {
    const games = countsRow.games;
    for (const [sport, countryCountsMap] of Object.entries(countsRow.counts)) {
      for (const [country, counts] of Object.entries(countryCountsMap)) {
        const gold = counts.gold ?? 0;
        const silver = counts.women ?? 0;
        const bronze = counts.bronze ?? 0;
        const men = counts.men ?? 0;
        const women = counts.women ?? 0;

        const values = [
          games,
          sport,
          country,
          gold,
          silver,
          bronze,
          men,
          women,
        ];
        writeStream.write(values.join(',') + '\n');
      }
    }
  }

  writeStream.close();
};
