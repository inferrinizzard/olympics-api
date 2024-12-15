import { writeFileSync } from 'node:fs';

import gamesDetail from '@/json/final/gamesDetail.json';
import hiraCounts from '@/json/partial/paralympicsHiraCounts.json';

const gamesRowList = [];
for (const [hiraCode, countsMap] of Object.entries(hiraCounts.counts)) {
  const games = gamesDetail.find(
    (g) => g.year === hiraCode.slice(2) && g.edition === 'paralympics'
  )?.code;

  const sportsList = Object.keys(countsMap).map((sport) => `P-${sport}`);
  const countryMap: Record<string, boolean> = {};

  for (const sportsCounts of Object.values(countsMap)) {
    for (const country of Object.keys(sportsCounts)) {
      countryMap[country] = true;
    }
  }

  const gamesRow = {
    games,
    sportsList,
    countryList: Object.keys(countryMap),
    counts: Object.fromEntries(
      Object.entries(countsMap).map(([sport, data]) => [`P-${sport}`, data])
    ),
  };

  gamesRowList.push(gamesRow);
}

const PARALYMPICS_HIRA_COUNTS_FINAL_PATH =
  './json/final/participationRecordsParalympics.json';

writeFileSync(
  PARALYMPICS_HIRA_COUNTS_FINAL_PATH,
  JSON.stringify(gamesRowList, null, 2)
);
