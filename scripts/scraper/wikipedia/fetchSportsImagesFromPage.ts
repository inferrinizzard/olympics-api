import { writeFileSync } from 'fs';
import wiki from 'wikipedia';

import sportsList from '../../../json/sportsDetail2.json';
import sportsPages from '../../../json/gamesSportsLinksMap.json';
import { extractImageFromInfobox, getInfoboxElement } from './infobox';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const matchSportMap = sportsList.reduce((map, sport) => {
  const key = sport.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  map[key] = sport.code;
  return map;
}, {} as Record<string, string>);

let fails = 0;
const noMatch = {} as Record<string, string[]>;
const gamesSportsImages = {} as Record<string, Record<string, string>>;

for (const [games, pageList] of Object.entries(sportsPages)) {
  console.log(games);
  noMatch[games] = [];
  gamesSportsImages[games] = {};
  for (const page of pageList) {
    const matchSportName = page
      .split('at the')[0]
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '');

    const sportCode = matchSportMap[matchSportName];
    if (!sportCode) {
      noMatch[games].push(page);
      continue;
    }

    try {
      const sportsPage = await wiki.page(page, {
        preload: true,
        fields: ['html'],
      });
      const infobox = getInfoboxElement(sportsPage._html);
      const sportsImage = extractImageFromInfobox(infobox);

      gamesSportsImages[games][sportCode] = sportsImage;
    } catch {
      fails++;
      console.log('FAILED', games, page);
      noMatch[games].push('FAILED:' + page);

      if (fails > 3) {
        break;
      }
    }
  }

  if (fails > 3) {
    break;
  }

  await delay(10000);
}

writeFileSync('./json/noMatch.json', JSON.stringify(noMatch, null, 2));
writeFileSync(
  './json/gamesSportsImages.json',
  JSON.stringify(gamesSportsImages, null, 2)
);
