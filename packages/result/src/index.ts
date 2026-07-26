/**
 * Result type to represent the synchronous outcome of an operation.
 * It can either be a success with a value or an error.
 *
 * It is also an object containing the ok and err functions to
 * make it easier to create Result objects.
 */
export type ResultSync<T, E extends Error> =
  | { readonly isError: false; readonly value: T }
  | { readonly isError: true; readonly error: E };

export const ResultSync = {
  /**
   * Creates a successful Result with the given value.
   * @param value The success value
   * @returns A Result object representing success
   */
  ok,
  /**
   * Creates an error Result with the given error.
   * @param error The error value
   * @returns A Result object representing error
   */
  err,
} as const;

/**
 * Async version of Result type that wraps a Result in a Promise.
 *
 * It is also an object containing the ok and err functions to
 * make it easier to create Result objects for async workflows.
 */
export type ResultAsync<T, E extends Error> = Promise<ResultSync<T, E>>;

export const ResultAsync = {
  /**
   * Creates a successful Result with the given value.
   * @param value The success value
   * @returns A Result object representing success
   */
  ok,
  /**
   * Creates an error Result with the given error.
   * @param error The error value
   * @returns A Result object representing error
   */
  err,
} as const;

function ok<T>(value: T): ResultSync<T, never> {
  return { isError: false, value };
}

function err<E extends Error>(error: E): ResultSync<never, E> {
  return { isError: true, error };
}
