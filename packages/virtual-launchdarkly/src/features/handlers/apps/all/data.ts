type Flag = {
  readonly key: string;
  readonly on: boolean;
  readonly fallthrough: { variation: number };
  readonly offVariation: number;
  readonly variations: [boolean, boolean];
};

type Flags = {
  readonly [key: string]: Flag;
};

type Data = {
  readonly segments: { [key: string]: unknown };
  readonly flags: Flags;
};

type AllData = {
  readonly path: string;
  readonly data: Data;
};

export const getAllData = (): AllData => ({
  path: '/',
  data: {
    segments: {},
    flags: {
      'ff-debug-test-false': {
        key: 'ff-debug-test-false',
        on: false,
        fallthrough: { variation: 1 },
        offVariation: 1,
        variations: [true, false],
      },
      'ff-debug-test-true': {
        key: 'ff-debug-test-true',
        on: true,
        fallthrough: { variation: 0 },
        offVariation: 1,
        variations: [true, false],
      },
      'ff-release-api-27-set-up-launch-darkly': {
        key: 'ff-release-api-27-set-up-launch-darkly',
        on: false,
        fallthrough: { variation: 0 },
        offVariation: 1,
        variations: [true, false],
      },
    },
  },
});
