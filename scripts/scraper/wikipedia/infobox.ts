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
