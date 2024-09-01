import { JSDOM } from 'jsdom';

export const getInfoboxElement = (html: string) => {
  const dom = new JSDOM(html);
  const infobox = dom.window.document.querySelector('table.infobox');
  return infobox as HTMLTableElement;
};

export const extractImageFromInfobox = (infobox: HTMLTableElement) => {
  const imageElement = infobox.querySelector('img');
  const src =
    imageElement?.getAttribute('src')?.replace(/^[/]{2}/, 'https://') ?? '';

  if (!src.includes('thumb')) {
    return src;
  }

  const imageUrl = src
    .replace(/[/]thumb[/]/, '/')
    .split('/')
    .slice(0, -1) // remove last segment after '/'
    .join('/');
  return imageUrl;
};
