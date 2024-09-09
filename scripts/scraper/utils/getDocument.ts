import { JSDOM } from 'jsdom';

export const getDocument = async (url: string) => {
  const response = await fetch(url);
  const document = new JSDOM(await response.text()).window.document;
  return document;
};
