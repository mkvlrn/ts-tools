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

type ResultFactory = {
  ok<T>(value: T): Result<T, never>;
  err<E extends Error>(error: E): Result<never, E>;
};

type ResultAsyncFactory = {
  ok<T>(value: T): ResultAsync<T, never>;
  err<E extends Error>(error: E): ResultAsync<never, E>;
};

export const Result: ResultFactory = {
  /**
   * Creates a successful Result with the given value.
   *
   * @param value The value indicating success
   * @returns A successful Result object
   */
  ok<T>(value: T): Result<T, never> {
    return { isError: false, value };
  },

  /**
   * Creates an error Result with the given error.
   *
   * @param error The error instance indicating failure
   * @returns An error Result object
   */
  err<E extends Error>(error: E): Result<never, E> {
    return { isError: true, error };
  },
};

export const ResultAsync: ResultAsyncFactory = {
  /**
   * Creates a Promise containing a successful Result with the given value.
   *
   * @param value The value indicating success
   * @returns A Promise containing a successful Result object
   */
  ok<T>(value: T): ResultAsync<T, never> {
    return Promise.resolve({ isError: false, value });
  },

  /**
   * Creates a Promise containing an error Result with the given error.
   *
   * @param error The error instance indicating failure
   * @returns A Promise containing an error Result object
   */
  err<E extends Error>(error: E): ResultAsync<never, E> {
    return Promise.resolve({ isError: true, error });
  },
};
