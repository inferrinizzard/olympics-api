import { JSDOM } from 'jsdom';

export const getDocument = async (url: string) => {
  const response = await fetch(url);

  if (response.status !== 200) {
    return response.status;
  }

  const document = new JSDOM(await response.text()).window.document;
  return document;
};
