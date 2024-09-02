import { JSDOM } from 'jsdom';

const extractCountryDataFromRow = (row: HTMLTableRowElement) => {
  const code = row.cells[0].textContent;
  const name = row.cells[1].textContent;

  return { code, name };
};

export const getCountryDataFromOlympedia = async () => {
  const OLYMPEDIA_COUNTRIES_PAGE_URL = 'https://www.olympedia.org/countries';
  const olympediaPage = await fetch(OLYMPEDIA_COUNTRIES_PAGE_URL);

  const document = new JSDOM(await olympediaPage.text()).window.document;

  const countryTable = document.querySelector('table');

  const activeCountryRows = [...(countryTable?.rows ?? [])]
    .slice(1) // Remove header
    .filter((row) => row.querySelector('span[class*="glyphicon-ok"]'));

  const countryData = activeCountryRows.map(extractCountryDataFromRow);

  return countryData;
};
