import { writeFileSync } from 'node:fs';

import olympicsDesignLinks from '@/json/partial/olympicDesignLinks.json';

import { getDocument } from '../utils/getDocument';

const OLYMPIC_DESIGN_SPORTS_PICTOGRAMS_LINKS_JSON_PATH =
  './json/partial/olympicDesignSportsPictograms.json';

const gamesSportsPictogramsLinks: Record<string, unknown> = {};

const getImageLinksForPage = async (link: string) => {
  const document = await getDocument(link);

  const imageBlocks = [
    ...document.getElementsByClassName('cc-m-hgrid-column'),
  ] as HTMLDivElement[];
  const unknown = imageBlocks
    .filter((el) => !el.querySelector('p')?.textContent?.trim())
    .flatMap((div) => div.querySelector('img')?.getAttribute('src') ?? [])
    .filter((url) => !url.includes('none'));

  const known = imageBlocks.filter((el) => el.querySelector('p')?.textContent);
  const imageMap = known.reduce((acc, div) => {
    const sport = div.querySelector('p')?.textContent?.trim() ?? '';
    acc[sport] = div.querySelector('img')?.getAttribute('src') ?? '';
    return acc;
  }, {} as Record<string, string>);

  // const aImageLinks = [
  //   ...document.querySelectorAll('a[rel="lightbox"] > img'),
  // ].flatMap((i) => i.getAttribute('src') ?? []);

  // const figureImageLinks = [
  //   ...document.querySelectorAll('figure > img'),
  // ].flatMap((i) => i.getAttribute('src') ?? []);

  // return [...aImageLinks, ...figureImageLinks];

  return { unknown, known: imageMap };
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
