import { createWriteStream, readdirSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

import countryData from '@/json/final/countryDetail.json';

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

async function downloadFile(url: string, filepath: string) {
  const response = await fetch(url);

  if (!response.body) {
    return;
  }

  // @ts-expect-error
  const body = Readable.fromWeb(response.body);
  const download_write_stream = createWriteStream(filepath);
  await finished(body.pipe(download_write_stream));
}

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
