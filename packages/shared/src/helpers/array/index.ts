// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unique = (array: any[]): any[] => {
  return [...new Set(array)];
};
