export const snake_case2camelCase = (str: string) =>
  str.replace(/_(\w)/g, (char) => char.toUpperCase().replace('_', ''));
