import { readdirSync } from 'node:fs';

import sportsDetail from '@/json/final/sportsDetail.json';
import { delay } from '../../utils/delay';

const existing = readdirSync('./images/sports/official');
const allExisting = existing.join(' ');

export const getSportsPictograms = async () => {
  const sportsMap: Record<string, string> = {};

  for (const sport of sportsDetail) {
    if (sport.code in sportsMap || sport.code.includes('P-')) {
      continue;
    }
    sportsMap[sport.code] = sport.name;
  }

  for (const [code, name] of Object.entries(sportsMap)) {
    if (allExisting.includes(code)) {
      console.log('Already have:', code);
      continue;
    }

    const urlName = name.replace(' ', '-').toLowerCase();
    const res = await fetch(`https://olympics.com/en/sports/${urlName}/`);
    await delay(5000);

    if (res.status === 404) {
      continue;
    }

    if (res.status === 200) {
      console.log({ code, name });
    }
  }
};

await getSportsPictograms();

// Pages that exist with no pictogram
// { code: 'FBS', name: 'Futsal' }
// { code: 'RUG', name: 'Rugby' }
// { code: 'WRB', name: 'Beach Wrestling' }
// { code: 'SKT', name: 'Skating' }
// { code: 'BBL', name: 'Baseball' }
// { code: 'SBL', name: 'Softball' }
// { code: 'RHO', name: 'Rink Hockey' }
// { code: 'SPS', name: 'Speed Skiing' }
// { code: 'BLD', name: 'Billiards' }
