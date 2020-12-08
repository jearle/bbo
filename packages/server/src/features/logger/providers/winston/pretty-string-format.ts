import { format } from 'winston';

import { blue, green, bgRed, yellow, bgMagenta } from 'chalk';

type Info = {
  readonly timestamp: string;
  readonly level: string;
  readonly message: string;
};

type PrettyStringFormatResult = {
  template: (info: Info) => string;
};

export const prettyStringFormat = (): PrettyStringFormatResult =>
  (<unknown>format.printf((info) => {
    const { timestamp, level, message } = info;

    const colorFunction = {
      debug: bgMagenta,
      info: green,
      warn: yellow,
      error: bgRed,
    }[level];

    const coloredLevel = colorFunction(level);

    return `${blue(timestamp)} ${coloredLevel} ${message}`;
  })) as PrettyStringFormatResult;
