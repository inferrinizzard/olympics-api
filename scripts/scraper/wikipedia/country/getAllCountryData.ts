import { JSDOM } from 'jsdom';
import wiki from 'wikipedia';

import type { PartialCountry } from '@/src/models';

const extractCountryDataFromRow = (
  row: HTMLTableRowElement
): Omit<PartialCountry, 'status'> | undefined => {
  const code = row.cells[0].querySelector('span')?.textContent;

  const detailCell = row.cells[1];

  if (!code || !detailCell) {
    console.log(row.textContent);
    return;
  }

  const validAnchorElement =
    [...detailCell.querySelectorAll('a')].find(
      (a) => a.childElementCount === 0
    ) ?? detailCell;
  const name = validAnchorElement?.textContent?.trim() ?? '';
  const pageLink = validAnchorElement?.getAttribute('href') ?? '';
  const pageName = pageLink.split('/').at(-1) ?? '';
  const rawImageUrl = detailCell.querySelector('img')?.getAttribute('src');

  const extractFirstImageSlug = (url: string, exts: string[]) => {
    for (const ext of exts) {
      if (url.includes(ext)) {
        return url.split(ext)[0] + ext;
      }
    }
    return url;
  };
  const imageUrl = extractFirstImageSlug(
    rawImageUrl?.replace(/[/]thumb[/]/, '/') ?? '',
    ['svg', 'jpg', 'png']
  );

  return {
    code,
    name,
    pageName,
    imageUrl: imageUrl.replace(/^[/]{2}/, 'https://'),
  };
};

const getAllCountryData = async () => {
  const iocCountryPageName = 'List_of_IOC_country_codes';
  const iocCountryPage = await wiki.page(iocCountryPageName, {
    preload: true,
    fields: ['html'],
  });

  const document = new JSDOM(iocCountryPage._html).window.document;

  const tables = [...document.querySelectorAll('table[class*="wikitable"]')];
  const statusHeaders = [...document.getElementsByTagName('h2')]
    .map((h2) => h2.textContent?.toLowerCase().split(' ')[0] ?? '')
    .slice(1);
  statusHeaders.splice(2, 0, statusHeaders[2]); // missing a 'historic' header

  let countryData: PartialCountry[] = [];

  tables.forEach((table, i) => {
    const status = statusHeaders[i];

    const rowDataList = [...(table as HTMLTableElement).rows]
      .slice(1) // Remove header
      .flatMap((row) => {
        const data = extractCountryDataFromRow(row);
        return data ? { ...data, status } : [];
      });

    countryData = [...countryData, ...rowDataList];
  });

  return countryData;
};

const countryData = await getAllCountryData();
console.log(JSON.stringify(countryData));
// tsx ./scripts/scraper/wikipedia/country/getAllCountryData.ts > ./json/partial/wikipediaCountryData.json
