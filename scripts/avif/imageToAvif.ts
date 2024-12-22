import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process';
import { existsSync } from 'node:fs';
const exec = promisify(_exec);

export const imageToAvif = async (path: string, options = '') => {
  const target = `${path.split('.')[0]}.avif`;

  if (existsSync(target)) {
    return;
  }

  console.log(`Converting ${path} to avif`);

  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
    return exec(`ffmpeg ${options} -i ${path} -crf 0 ${target}`);
  }

  if (path.endsWith('.png')) {
    return exec(
      `ffmpeg ${options} -i ${path} -map 0 -map 0 -filter:v:1 alphaextract -frames:v 1 -c:v libaom-av1 -still-picture 1 -crf 0 ${target}`
    ).catch(() => {
      exec(`ffmpeg ${options} -i ${path} -crf 0 ${target}`);
    });
  }

  console.log('UNKNOWN', { path });
};
