export const snake_case2camelCase = (str: string) =>
  str.replace(/_(\w)/g, (char) => char.toUpperCase().replace('_', ''));

export const camelCase2snake_case = (str: string) =>
  str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
