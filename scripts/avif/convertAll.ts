import { existsSync, readdirSync } from 'node:fs';
import { exec as _exec } from 'node:child_process';
import { exit } from 'node:process';
import { promisify } from 'node:util';
const exec = promisify(_exec);

import { avifQueue } from './avifQueue.json';
import { imageToAvif } from './imageToAvif';

// # Options
const root = 'images/games';
const force = false;
const shouldUseTraversalQueue = true;

// # Assemble Options
let options = '';

if (force) {
  options += '-y';
}

// # Main
const buildTraversalQueue = () => {
  const outputQueue = [];

  const rootDir = readdirSync(root);
  const queue = rootDir
    .filter((file) => !file.includes('.'))
    .map((game) => ({
      parent: root,
      leaf: game,
    }));

  for (const { parent, leaf } of queue) {
    const files = readdirSync(`${parent}/${leaf}`).filter(
      (file) => !file.startsWith('_') && !file.startsWith('.')
    );

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

      outputQueue.push(path);
    }
  }

  return outputQueue;
};

while (true) {
  const queue = shouldUseTraversalQueue ? buildTraversalQueue() : avifQueue;

  if (!queue.length) {
    console.log('Done');
    exit(0);
  }

  for (let i = 0; i < queue.length; i += 8) {
    const chunk = queue.slice(i, i + 8);

    await Promise.all([
      ...chunk.map((path) => imageToAvif(path)),
      new Promise<void>((resolve, reject) => {
        setTimeout(() => reject('TIMED OUT'), 60_000);
      }),
    ]).catch(() => {});
    await exec('find ./images/games -size 0 -print -delete');
  }
}
