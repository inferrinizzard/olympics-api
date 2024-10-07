import { createWriteStream } from 'node:fs';

import countsData from '@/json/final/participationRecords.json';

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

const PARTICIPATION_RECORDS_CSV_PATH = './csv/participationRecords.csv';

const convertCountsJson2csv = () => {
  const writeStream = createWriteStream(PARTICIPATION_RECORDS_CSV_PATH);

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

convertCountsJson2csv();
