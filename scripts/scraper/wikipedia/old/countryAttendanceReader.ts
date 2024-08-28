import { JSDOM } from 'jsdom';

import Wikipedia from './index';

import type { GamesKey } from '../../types';

const summerCountriesUrl =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Summer_Olympic_Games&prop=text&section=11&formatversion=2';
const winterCountriesUrl =
  'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Winter_Olympic_Games&prop=text&section=9&formatversion=2';

const readCountryTable = (sourceTable: HTMLTableElement) => {
  const presentMarker = /[•^]/;

  let years = [];
  let countryData: Record<string, number[]> = {};

  // extract years from header row
  const headerRow = sourceTable.rows[0] as HTMLTableRowElement;
  for (let i = headerRow.cells.length - 2, century = '20'; i >= 2; i--) {
    const year = headerRow.cells[i].textContent;
    const fullYear = parseInt(century + headerRow.cells[i].textContent);
    if (year === '00' || year == '02') {
      century = parseInt(century) - 1 + '';
    }

    years.unshift(fullYear);
  }

  for (let i = 1; i < sourceTable.rows.length - 1; i++) {
    const row = sourceTable.rows[i] as HTMLTableRowElement;

    const nameColumn = row.cells[0] as HTMLTableCellElement;
    // get NOC code
    const countryCode = row.cells[1].textContent!.trim();

    if (
      nameColumn.textContent?.trim().match(/^[A-Z]{1}$/) ||
      !countryCode.match(/^[A-Z0-9]{3}$/)
    ) {
      continue; // skip if letter
    }

    let attended = [];
    // iterate through cells and mark years present
    for (
      let cellIndex = 0, yearIndex = 0;
      cellIndex < row.cells.length - 3;
      cellIndex++, yearIndex++
    ) {
      let cell = row.cells[cellIndex + 2] as HTMLTableCellElement; // start from 3rd column

      // skip rowspan cells
      while (
        [1916, 1940, 1944].includes(years[yearIndex]) &&
        !row.querySelector('td[rowspan]') // checks if this is a row with rowspan
      ) {
        yearIndex++;
      }

      // handle wide cells
      if (cell.hasAttribute('colspan')) {
        const width = cell.getAttribute('colspan')!;
        yearIndex += parseInt(width) - 1;
        continue;
      }

      const cellMarker = cell.textContent?.trim()[0] ?? '';
      if (presentMarker.test(cellMarker)) {
        const year = years[yearIndex];
        attended.push(year);
      }
    }

    countryData[countryCode] = attended;
  }

  return countryData;
};

export const readCountryAttendance = async (
  gamesKeyLookup: (year: number, season: string) => string
) => {
  // read DOM from parsed HTML request
  const summerCountriesTable = Wikipedia.extractTable(
    new JSDOM(await Wikipedia.getPageHtml(summerCountriesUrl))
  );
  const winterCountriesTable = Wikipedia.extractTable(
    new JSDOM(await Wikipedia.getPageHtml(winterCountriesUrl))
  );

  let countryAttendance = {} as Record<GamesKey, string[]>;
  // extract table data
  const summerTableData = Object.entries(
    readCountryTable(summerCountriesTable)
  );
  const winterTableData = Object.entries(
    readCountryTable(winterCountriesTable)
  );

  summerTableData.forEach(
    ([country, attended]) =>
      (countryAttendance[country] = attended.map((year) =>
        gamesKeyLookup(year, 'summer')
      ))
  );
  winterTableData.forEach(([country, attended]) =>
    (countryAttendance[country] = countryAttendance[country] ?? []).concat(
      attended.map((year) => gamesKeyLookup(year, 'winter'))
    )
  );

  return countryAttendance;
};
