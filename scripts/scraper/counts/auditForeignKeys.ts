import countryDetail from '@/json/final/countryDetail.json';
import sportsDetail from '@/json/final/sportsDetail.json';

import { readFromCsv } from '@/src/_manual/readFromFile';

const participationRecords = await readFromCsv('participation_records');

const countryExists: Record<string, boolean> = {};
const sportExists: Record<string, boolean> = {};

const countryMissing: Record<string, boolean> = {};
const sportMissing: Record<string, boolean> = {};

participationRecords.forEach((row, i) => {
  if (countryExists[row.country] && sportExists[row.sport]) {
    return;
  }

  const countryMatch = countryDetail.find(
    (country) => country.code === row.country
  );
  if (countryMatch) {
    countryExists[countryMatch.code] = true;
  }

  const sportMatch = sportsDetail.find((sport) => sport.code === row.sport);
  if (sportMatch) {
    sportExists[sportMatch.code] = true;
  }

  const missingText = [];

  if (!countryMatch && !countryMissing[row.country]) {
    countryMissing[row.country] = true;
    missingText.push(!countryMatch ? `Country (${row.country})` : '');
  }
  if (!sportMatch && !sportMissing[row.sport]) {
    sportMissing[row.sport] = true;
    missingText.push(!sportMatch ? `Sport (${row.sport})` : '');
  }

  if (missingText.length) {
    console.log(`L[${i + 2}] - Found mismatch:`, ...missingText);
  }
});
