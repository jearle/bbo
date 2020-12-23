export const csvToArray = (csv?: string | null | undefined): string[] => {
  if (csv === null || csv === undefined || csv.trim() === ``) return [];

  return csv.split(`,`);
};
