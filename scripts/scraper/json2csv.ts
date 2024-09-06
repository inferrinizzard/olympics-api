import { createWriteStream, write } from 'node:fs';

export const json2csv = (objRows: Record<string, unknown>[], path: string) => {
  const keyMap: Record<string, string> = {};

  for (const obj of objRows) {
    for (const key of Object.keys(obj)) {
      keyMap[key] = key.replace(/([A-Z])/g, (char) => '_' + char.toLowerCase());
    }
  }

  const finalKeys = Object.values(keyMap);

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
