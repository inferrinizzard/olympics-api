import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

import olympicsDesignLinks from '@/json/partial/olympicDesignLinks.json';

const OLYMPIC_DESIGN_SPORTS_PICTOGRAMS_LINKS_JSON_PATH =
  './json/partial/olympicDesignSportsPictograms.json';

const gamesSportsPictogramsLinks: Record<string, string[]> = {};

const getImageLinksForPage = async (link: string) => {
  const response = await fetch(link);
  const document = new JSDOM(await response.text()).window.document;

  const aImageLinks = [
    ...document.querySelectorAll('a[rel="lightbox"] > img'),
  ].flatMap((i) => i.getAttribute('src') ?? []);

  const figureImageLinks = [
    ...document.querySelectorAll('figure > img'),
  ].flatMap((i) => i.getAttribute('src') ?? []);

  return [...aImageLinks, ...figureImageLinks];
};

for (const link of olympicsDesignLinks.main) {
  const imageUrls = await getImageLinksForPage(link);

  const linkSlugs = link
    .split('.com')[1]
    .replace('-game', '')
    .replace(/(^[/]|[/]$)/g, '')
    .split('/');
  const games = `${linkSlugs[2]}_${linkSlugs[0]}`;

  gamesSportsPictogramsLinks[games] = imageUrls;
}

writeFileSync(
  OLYMPIC_DESIGN_SPORTS_PICTOGRAMS_LINKS_JSON_PATH,
  JSON.stringify(gamesSportsPictogramsLinks, null, 2)
);
