import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

export async function downloadFile(url: string, filepath: string) {
  const response = await fetch(url);

  if (!response.body) {
    return;
  }

  // @ts-expect-error
  const body = Readable.fromWeb(response.body);
  const download_write_stream = createWriteStream(filepath);
  await finished(body.pipe(download_write_stream));
  download_write_stream.close();
}
