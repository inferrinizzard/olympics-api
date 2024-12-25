import { createWriteStream, readdirSync, writeFileSync } from 'node:fs';

import countryData from '@/json/final/countryDetail.json';
import { downloadFile } from '../../utils/downloadFile';

const flagMap: Record<string, string[]> = {};

// Build map of flag url to codes
for (const country of countryData) {
  flagMap[country.imageUrl] = [
    ...(flagMap[country.imageUrl] ?? []),
    country.code,
  ];
}

const existingFlags = readdirSync('./images/country').reduce((acc, flag) => {
  acc[flag.split('.')[0]] = 1;
  return acc;
}, {} as Record<string, number>);

const sharedFlags: [string, string[]][] = [];

for (const [flagUrl, codes] of Object.entries(flagMap)) {
  if (codes.length > 1) {
    sharedFlags.push([flagUrl, codes]);
    continue;
  }

  const code = codes[0];
  if (code in existingFlags) {
    continue;
  }

  console.log('MISSING', code);

  const fileName = `${code}.${flagUrl.split('.').at(-1)}`;
  downloadFile(flagUrl, `./images/country/${fileName}`);
}

const sharedFlagMap: Record<string, string> = {};

for (const [flagUrl, codes] of sharedFlags) {
  const sharedFlagName = flagUrl.split('/').at(-1) ?? '';

  for (const code of codes) {
    sharedFlagMap[code] = sharedFlagName;

    if (code in existingFlags) {
      console.log('EXTRA', code);
    }
  }

  downloadFile(flagUrl, `./images/country/shared/${sharedFlagName}`);
}

writeFileSync(
  './images/country/shared/sharedFlags.json',
  JSON.stringify(sharedFlagMap, null, 2)
);
