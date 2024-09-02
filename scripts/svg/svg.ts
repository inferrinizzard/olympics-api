import * as fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

import sportList from './sports_2024.json';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAndDownloadToFile = async (url: string, destFile: string) => {
  const { body } = await fetch(url);

  if (!body) {
    return;
  }

  const fileStream = fs.createWriteStream(destFile, { flags: 'wx' });
  Readable.from(body).pipe(fileStream);
};

const failed = [];

const urlTemplate = `https://olympics.com/images/static/sports/pictograms/v2/XXX.svg`;
for (const { sport, name } of sportList) {
  const url = urlTemplate.replace(/XXX/, sport);

  const outPath = `./${sport}.svg`;

  if (fs.existsSync(outPath)) {
    continue;
  }

  console.log({ sport, url });
  try {
    await fetchAndDownloadToFile(url, outPath);
  } catch (e) {
    console.log(e);
    console.log({ sport });
    failed.push(sport);
    continue;
  }

  await sleep(10000);

  // break;
}

console.log();
console.log('FAILED', { failed });
