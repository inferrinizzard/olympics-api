import { readFileSync } from 'node:fs';

import got from 'got';
import { JSDOM } from 'jsdom';

export const getDocument = async (url: string, caPemPath?: string) => {
  if (caPemPath) {
    const response = await got(url, {
      https: {
        rejectUnauthorized: false,
        // certificateAuthority: readFileSync(caPemPath),
      },
    });

    if (response.errored) {
      return response.statusCode;
    }

    const document = new JSDOM(await response.body).window.document;
    return document;
  }

  const response = await fetch(url);
  if (response.status !== 200) {
    return response.status;
  }
  const document = new JSDOM(await response.text()).window.document;
  return document;
};
