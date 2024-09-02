import { JSDOM } from 'jsdom';
import wiki from 'wikipedia';

import type { PartialCountry } from '@/src/models';

const extractCountryDataFromRow = (
  row: HTMLTableRowElement
): Omit<PartialCountry, 'status'> | undefined => {
  const code = row.cells[0].textContent;

  const detailCell = row.cells[1];

  if (!code || !detailCell) {
    console.log(row.textContent);
    return;
  }

  const name = detailCell?.textContent ?? '';
  const pageLink = detailCell.querySelector('a')?.getAttribute('href') ?? '';
  const pageName = pageLink.split('/').at(-1) ?? '';
  const rawImageUrl = detailCell.querySelector('img')?.getAttribute('src');
  const imageUrl =
    // biome-ignore lint/style/useTemplate: <explanation>
    rawImageUrl?.replace(/[/]thumb[/]/, '/').split('.svg')[0] + '.svg';

  return {
    code,
    name,
    pageName,
    imageUrl: imageUrl.replace(/^[/]{2}/, 'https://'),
  };
};

export const getAllCountryData = async () => {
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
