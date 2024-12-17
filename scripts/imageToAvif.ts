import { existsSync, readdirSync } from 'node:fs';

import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
const exec = promisify(_exec);

const root = 'images/games';
const force = true;
let options = '';

if (force) {
  options += '-y';
}

const rootDir = readdirSync(root);
const queue = rootDir
  .filter((file) => !file.includes('.'))
  .map((game) => ({
    parent: root,
    leaf: game,
  }));

for (const { parent, leaf } of queue) {
  const files = readdirSync(`${parent}/${leaf}`);

  const subdirs = files.filter((file) => !file.includes('.'));
  queue.push(
    ...subdirs.map((dir) => ({ parent: `${parent}/${leaf}`, leaf: dir }))
  );

  const nonSvgImages = files.filter(
    (file) =>
      file.includes('.') && !file.endsWith('.svg') && !file.endsWith('.avif')
  );

  for (const image of nonSvgImages) {
    const path = `${parent}/${leaf}/${image}`;
    const target = `${path.split('.')[0]}.avif`;

    if (!force && existsSync(target)) {
      continue;
    }

    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      exec(`ffmpeg ${options} -i ${path} -crf 0 ${target}`);
    } else if (path.endsWith('.png')) {
      exec(
        `ffmpeg ${options} -i ${path} -map 0 -map 0 -filter:v:1 alphaextract -frames:v 1 -c:v libaom-av1 -still-picture 1 -crf 0 ${
          path.split('.')[0]
        }.avif`
      ).catch(() => {
        exec(`ffmpeg ${options} -i ${path} -crf 0 ${target}`);
      });
    } else {
      console.log('UNKNOWN', { path });
    }
  }
}
