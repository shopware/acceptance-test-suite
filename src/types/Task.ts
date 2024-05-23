/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Task = (...args: any[]) => () => Promise<void>;