import { format } from 'winston';
import { blue, green, bgRed, yellow, bgMagenta } from 'chalk';

export const prettyStringFormat = () =>
  format.printf((info) => {
    const { timestamp, level, message } = info;

    const colorFunction = {
      debug: bgMagenta,
      info: green,
      warn: yellow,
      error: bgRed,
    }[level];

    const coloredLevel = colorFunction(level);

    return `${blue(timestamp)} ${coloredLevel} ${message}`;
  });
