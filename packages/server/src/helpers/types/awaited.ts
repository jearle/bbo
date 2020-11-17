export type Awaited<T> = T extends PromiseLike<infer U>
  ? U
  : T extends (...args: any[]) => PromiseLike<infer V>
  ? V
  : T;
