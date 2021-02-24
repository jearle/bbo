export const unique = (array: unknown[]): unknown[] => {
  return [...new Set(array)];
};
