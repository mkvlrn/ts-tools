/**
 * Synchronous outcome of an operation, representing either a success value or an error.
 */
type Result<TValue, TError extends Error> =
  | { readonly isError: false; readonly value: TValue }
  | { readonly isError: true; readonly error: TError };

/**
 * Asynchronous outcome of an operation, wrapping a synchronous Result in a Promise.
 */
type ResultAsync<TValue, TError extends Error> = Promise<Result<TValue, TError>>;

interface ResultFactory {
  ok: <TValue>(value: TValue) => Result<TValue, never>;
  err: <TError extends Error>(error: TError) => Result<never, TError>;
}

interface ResultAsyncFactory {
  ok: <TValue>(value: TValue) => ResultAsync<TValue, never>;
  err: <TError extends Error>(error: TError) => ResultAsync<never, TError>;
}

const Result: ResultFactory = {
  /**
   * Creates an error Result with the given error.
   *
   * @param error The error instance indicating failure
   * @returns An error Result object
   */
  err<TError extends Error>(error: TError): Result<never, TError> {
    return { error, isError: true };
  },

  /**
   * Creates a successful Result with the given value.
   *
   * @param value The value indicating success
   * @returns A successful Result object
   */
  ok<TValue>(value: TValue): Result<TValue, never> {
    return { isError: false, value };
  },
};

const ResultAsync: ResultAsyncFactory = {
  /**
   * Creates a Promise containing an error Result with the given error.
   *
   * @param error The error instance indicating failure
   * @returns A Promise containing an error Result object
   */
  async err<TError extends Error>(error: TError): ResultAsync<never, TError> {
    return Promise.resolve({ error, isError: true });
  },

  /**
   * Creates a Promise containing a successful Result with the given value.
   *
   * @param value The value indicating success
   * @returns A Promise containing a successful Result object
   */
  async ok<TValue>(value: TValue): ResultAsync<TValue, never> {
    return Promise.resolve({ isError: false, value });
  },
};

export { Result, ResultAsync };
