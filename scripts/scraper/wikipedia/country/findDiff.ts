import wikipediaData from '@/json/partial/wikipediaCountryData.json';
import olympediaData from '@/json/partial/olympediaCountryData.json';

import type { PartialCountry } from '@/src/models';

const wikipediaMap = wikipediaData.reduce((map, country) => {
  map[country.code] = country;
  return map;
}, {} as Record<string, PartialCountry>);

for (const country of olympediaData) {
  if (!wikipediaMap[country.code]) {
    console.log(country.code, country.name);
  }
}
