import { createWriteStream, write } from 'node:fs';

export const json2csv = (objRows: Record<string, unknown>[], path: string) => {
  const keyMap: Record<string, boolean> = {};

  for (const obj of objRows) {
    for (const key of Object.keys(obj)) {
      keyMap[key] = true;
    }
  }

  const finalKeys = Object.keys(keyMap);

  const writeStream = createWriteStream(path);

  writeStream.write(finalKeys.join(',') + '\n');

  for (const obj of objRows) {
    const values = [];
    for (const key of finalKeys) {
      values.push(JSON.stringify(obj[key]));
    }

    writeStream.write(values.join(',') + '\n');
  }

  writeStream.close();
};
