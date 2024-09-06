import wiki from 'wikipedia';
import { JSDOM } from 'jsdom';

import { matchSportNameToCode } from './matchSportNameToCode';

const getOlympicsSportsPageNames = async () => {
  const OLYMPICS_SPORTS_PAGE_NAME = 'Olympic_sports';
  const olympicsSportsPage = await wiki.page(OLYMPICS_SPORTS_PAGE_NAME, {
    preload: true,
    fields: ['html'],
  });

  const document = new JSDOM(olympicsSportsPage._html).window.document;

  const rawSportsLinks = [...document.getElementsByTagName('a')]
    .flatMap((a) => a.getAttribute('href') ?? [])
    .filter((link) => link.includes('at_the') && !link.includes('redlink=1'))
    .map((link) => link.replace(/^[/]\w+[/]/, ''))
    .sort((a, b) => a.length - b.length); // sort by length ASC to allow base link to appear before year links

  const pageMap: Record<string, string> = {};

  for (const link of rawSportsLinks) {
    const noYear = link.replace(/\d{4}_/, '');

    if (noYear in pageMap) {
      continue;
    }

    pageMap[noYear] = link;
  }

  return Object.values(pageMap).filter(
    (link) => !(link.includes(':') || link.includes('List'))
  );
};

const getParalympicsSportsPageNames = async () => {
  const PARALYMPICS_SPORTS_PAGE_NAME = 'Paralympic_sports';
  const paralympicsSportsPage = await wiki.page(PARALYMPICS_SPORTS_PAGE_NAME, {
    preload: true,
    fields: ['html'],
  });

  const document = new JSDOM(paralympicsSportsPage._html).window.document;

  const sportsLinks = [...document.getElementsByTagName('a')]
    .filter(
      (a) =>
        a.textContent?.toLowerCase() === 'summer sport' ||
        a.textContent?.toLowerCase() === 'winter sport'
    )
    .flatMap((a) => a.getAttribute('href')?.replace(/^[/]\w+[/]/, '') ?? []);

  return sportsLinks.filter((link) => !link.includes('redlink=1'));
};

const matchLinksToSports = (sportsLinks: string[]) => {
  const sportsNames = sportsLinks.map((link) => link.split('at_the')[0]);

  return sportsNames.reduce((acc, sport, i) => {
    const sportCode = matchSportNameToCode(sport);
    acc[sportCode] = sportsLinks[i];
    return acc;
  }, {} as Record<string, string>);
};
