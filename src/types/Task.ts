/**
 * Generic task type that accepts any parameters
 */
export type Task<TArgs extends unknown[] = never[]> = (...args: TArgs) => () => Promise<void>;