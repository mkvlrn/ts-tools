/**
 * Synchronous outcome of an operation, representing either a success value or an error.
 */
export type Result<T, E extends Error> =
  | { readonly isError: false; readonly value: T }
  | { readonly isError: true; readonly error: E };

/**
 * Asynchronous outcome of an operation, wrapping a synchronous Result in a Promise.
 */
export type ResultAsync<T, E extends Error> = Promise<Result<T, E>>;

/**
 * Creates a successful Result with the given value.
 *
 * @param value The value indicating success
 * @returns A successful Result object
 */
export function okResult<T>(value: T): Result<T, never> {
  return { isError: false, value };
}

/**
 * Creates an error Result with the given error.
 *
 * @param error The error instance indicating failure
 * @returns An error Result object
 */
export function errResult<E extends Error>(error: E): Result<never, E> {
  return { isError: true, error };
}
