/**
 * Generic task type that accepts any parameters
 */
export type Task<TArgs extends unknown[] = any[]> = (...args: TArgs) => () => Promise<void>;
