export type Awaited<T> = T extends PromiseLike<infer U>
  ? U
  : T extends (...args: unknown[]) => PromiseLike<infer V>
  ? V
  : T;
