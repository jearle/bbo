export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAN', 'CNY', 'LOC'] as const;
export type Currency = typeof currencies[number];
export const isValidCurrency = (value) => currencies.includes(value.toUpperCase())
