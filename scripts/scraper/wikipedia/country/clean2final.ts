import { writeFileSync } from 'node:fs';

import { json2csv } from '@/scripts/scraper/json2csv';

import countryData from '@/json/partial/wikipediaCountryData.json';
import type { PartialCountry } from '@/src/models';

const findDuplicateCodes = () => {
  const freq = {} as Record<string, number>;

  for (const c of countryData) {
    if (freq[c.code]) {
      freq[c.code]++;
    } else {
      freq[c.code] = 1;
    }
  }

  return Object.fromEntries(Object.entries(freq).filter(([k, v]) => v > 1));
};

const duplicates = findDuplicateCodes();
console.log({ duplicates });

const replaceDuplicateCodes = (obj: PartialCountry) => {
  if (obj.name === 'Republic of China') {
    return { ...obj, code: 'KMT' };
  }
  if (obj.name === 'British Guiana') {
    return { ...obj, code: 'BGU' };
  }
  if (obj.code === 'ZZX' && obj.status === 'special') {
    return { ...obj, code: 'XXB' };
  }
  if (
    (obj.code === 'ANZ' && obj.status === 'special') ||
    (obj.code === 'EUA' && obj.status === 'special') ||
    (obj.code === 'EUN' && obj.status === 'historic') ||
    obj.name === 'Individual Paralympic Athletes'
  ) {
    return [];
  }
  return obj;
};

const replacePageName = (obj: PartialCountry) => {
  if (obj.code === 'IHO') {
    return { ...obj, pageName: 'Indonesia_at_the_1952_Summer_Olympics' };
  }
  if (obj.code === 'MAL') {
    return { ...obj, pageName: 'Malaya_at_the_Olympics' };
  }
  if (obj.code === 'IPA' || obj.code === 'PNA') {
    return {
      ...obj,
      pageName: 'Independent_Paralympians_at_the_Paralympic_Games',
    };
  }
  if (
    obj.code === 'VNM' ||
    obj.code === 'ZAI' ||
    obj.code === 'BIR' ||
    obj.code === 'BGU'
  ) {
    return { ...obj, pageName: `${obj.pageName}_at_the_Olympics` };
  }
  return obj;
};

const statusMap: Record<string, number> = {
  current: 10,
  special: 20,
  historic: 30,
};

const replaced = countryData
  .flatMap(replaceDuplicateCodes)
  .map(replacePageName);
const processed = replaced.sort(
  (a, b) =>
    statusMap[a.status] - statusMap[b.status] + (b.name < a.name ? 1 : -1)
);

writeFileSync(
  './json/final/countryDetail.json',
  JSON.stringify(processed, null, 2)
);
json2csv(
  processed.map(({ imageUrl, ...obj }) => obj),
  './csv/countryDetail.csv'
);
