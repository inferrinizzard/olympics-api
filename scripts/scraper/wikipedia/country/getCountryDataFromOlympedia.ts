import { getDocument } from '../../utils/getDocument';

const extractCountryDataFromRow = (row: HTMLTableRowElement) => {
  const code = row.cells[0].textContent;
  const name = row.cells[1].textContent;

  return { code, name };
};

const getCountryDataFromOlympedia = async () => {
  const OLYMPEDIA_COUNTRIES_PAGE_URL = 'https://www.olympedia.org/countries';
  const document = await getDocument(OLYMPEDIA_COUNTRIES_PAGE_URL);

  const countryTable = document.querySelector('table');

  const activeCountryRows = [...(countryTable?.rows ?? [])]
    .slice(1) // Remove header
    .filter((row) => row.querySelector('span[class*="glyphicon-ok"]'));

  const countryData = activeCountryRows.map(extractCountryDataFromRow);

  return countryData;
};

const countryData = await getCountryDataFromOlympedia();
console.log(JSON.stringify(countryData));
// tsx ./scripts/scraper/wikipedia/country/getCountryDataFromOlympedia.ts > ./json/partial/olympediaCountryData.json
