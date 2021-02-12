export const csvToIntArray = (csv?: string | null | undefined): number[] => {
  if (csv === null || csv === undefined || csv.trim() === ``) return [];

  return csv.split(`,`).map((item: string) => parseInt(item));
};
