import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const PARALYMPICS_GAMES_MAIN_URL =
  'https://www.paralympic.org/paralympic-games';

const getDocument = async (url: string) => {
  const response = await fetch(url);
  const document = new JSDOM(await response.text()).window.document;
  return document;
};

const getGamesLinks = (document: Document) => {
  const anchors = [...document.querySelectorAll('a.event')];
  const titleAndHref = anchors.flatMap((a) =>
    a.getAttribute('title')
      ? [[a.getAttribute('title'), a.getAttribute('href')] as [string, string]]
      : []
  );

  return Object.fromEntries(titleAndHref);
};

let document = await getDocument(PARALYMPICS_GAMES_MAIN_URL);

const links = getGamesLinks(document);

for (let i = 1; i < 10; i++) {
  document = await getDocument(`${PARALYMPICS_GAMES_MAIN_URL}?page=${i}`);
  const curLinks = Object.entries(getGamesLinks(document));

  if (!curLinks.length) {
    break;
  }

  for (const [key, val] of curLinks) {
    if (!(key in links)) {
      links[key] = val;
    }
  }
}

writeFileSync(
  './json/partial/paralympicsGamesResultsLinks.json',
  JSON.stringify(links, null, 2)
);
