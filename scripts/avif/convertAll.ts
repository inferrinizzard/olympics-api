import { existsSync, readdirSync } from 'node:fs';
import { exec } from 'node:child_process';

import { avifQueue } from './avifQueue.json';
import { imageToAvif } from './imageToAvif';

// # Options
const root = 'images/games';
const force = false;
const shouldUseTraversalQueue = false;

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

      outputQueue.push(path);
    }
  }

  return outputQueue;
};

const queue = shouldUseTraversalQueue ? buildTraversalQueue() : avifQueue;

await Promise.all([
  ...queue.map((path) => imageToAvif(path)),
  new Promise<void>((resolve, reject) => {
    setTimeout(() => reject('TIMED OUT'), 300_000);
  }),
]).finally(() => {
  console.log('Done');
  exec('find ./images/games -size 0 -print -delete');
  console.log('Deleting failures');
});
