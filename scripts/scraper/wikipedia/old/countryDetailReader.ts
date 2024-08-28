import { JSDOM } from 'jsdom';

import Wikipedia from '../wikipedia-api';

import type { CountryDetailRow } from '../../types';

const currentCountriesUrl =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_IOC_country_codes&prop=text&section=2&disabletoc=1&formatversion=2';
const historicCountriesUrl =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_IOC_country_codes&prop=text&section=5&disabletoc=1&formatversion=2';
const olympicCountriesUrl =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_IOC_country_codes&prop=text&section=7&disabletoc=1&formatversion=2';

export const readCountryDetail = async () => {
  // get html section from wikipedia api, extract table element
  const currentCountries = new JSDOM(
    await Wikipedia.getPageHtml(currentCountriesUrl)
  );
  const currentCountriesTable = Wikipedia.extractTable(currentCountries);

  // get html section from wikipedia api, extract table element
  const historicCountries = new JSDOM(
    await Wikipedia.getPageHtml(historicCountriesUrl)
  );
  const historicCountriesTable = Wikipedia.extractTable(historicCountries);

  // get html section from wikipedia api, extract table element
  const olympicCountries = new JSDOM(
    await Wikipedia.getPageHtml(olympicCountriesUrl)
  );
  const olympicCountriesTable = Wikipedia.extractTable(olympicCountries);

  let countryDetail: CountryDetailRow[] = [];
  // iterate through all valid rows (has flag) and extract country code, name, and flag
  for (const row of [
    ...currentCountriesTable.rows,
    ...historicCountriesTable.rows,
    ...olympicCountriesTable.rows,
  ]) {
    if (!row.cells[1].getElementsByTagName('img').length) continue;

    const countryCode = row.cells[0]
      .querySelector('span.monospaced')!
      .textContent!.trim();
    const countryName =
      row.cells[1].querySelector('a[href^="/wiki/"]')!.textContent!.trim() ||
      row.cells[1]!.textContent!.trim();
    const flag = row.cells[1]
      .getElementsByTagName('img')[0]
      .getAttribute('src')!
      .replace(/^[/]{2}/, 'https://');

    countryDetail.push({
      country: countryCode,
      name: countryName,
      flag,
    });
  }

  return countryDetail.reduce(
    (countries, cur) =>
      countries.find((c) => c.country === cur.country)
        ? countries
        : [...countries, cur],
    [] as CountryDetailRow[]
  );
};
