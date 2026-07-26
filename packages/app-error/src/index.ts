import { getReasonPhrase, StatusCodes } from "http-status-codes";

/**
 * Union of all valid HTTP status code names exposed by `http-status-codes`.
 * Used to constrain the values in a `defineErrors` mapping so only real
 * status names (e.g. `"BAD_REQUEST"`, `"NOT_FOUND"`) are accepted.
 */
type StatusName = keyof typeof StatusCodes;

/**
 * A structured application error that carries a custom error code,
 * an HTTP status code, and an optional cause.
 *
 * Extends the native `Error` class so it works with every standard
 * error-handling mechanism (`try/catch`, `instanceof`, etc.).
 *
 * @template T - String literal union of your application's error codes.
 */
export class AppError<T extends string> extends Error {
  /** Always `"AppError"` — useful for quick `error.name` checks. */
  override readonly name = "AppError";

  /** The application-specific error code (e.g. `"USER_NOT_FOUND"`). */
  readonly code: T;

  /** Numeric HTTP status code (e.g. `404`). */
  readonly statusCode: number;

  /** Human-readable HTTP status phrase (e.g. `"Not Found"`). */
  readonly status: string;

  /**
   * @param code       Application error code.
   * @param statusCode Numeric HTTP status code.
   * @param message    Human-readable error message.
   * @param cause      Optional underlying cause (attached to `Error.cause`).
   */
  constructor(code: T, statusCode: number, message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
    this.code = code;
    this.statusCode = statusCode;
    this.status = getReasonPhrase(this.statusCode);
  }

  /**
   * Returns a plain object representation of the error, suitable
   * for JSON responses or logging.
   */
  serialize(): { code: string; message: string; details: unknown } {
    return {
      code: this.code,
      message: this.message,
      details: this.cause,
    };
  }
}

/**
 * Extracts a fully qualified `AppError` type from the return value of `defineErrors`.
 *
 * @example
 * ```typescript
 * const errors = defineErrors({ USER_NOT_FOUND: "NOT_FOUND" });
 * type MyAppError = InferAppError<typeof errors>;
 * // → AppError<"USER_NOT_FOUND">
 * ```
 */
export type InferAppError<T> = T extends {
  create: (code: infer E extends string, message: string, cause?: unknown) => AppError<infer E>;
}
  ? AppError<E>
  : never;

/**
 * Creates a pair of error factory functions (`throw` and `create`) from a
 * mapping of application error codes to HTTP status names.
 *
 * Define the mapping once, then use the returned helpers everywhere —
 * you get full type-safety on error codes and never have to remember
 * which numeric status goes with which code.
 *
 * @template T - String literal union derived from the mapping keys.
 * @param mapping - An object whose keys are your error codes and whose
 *                  values are HTTP status names (e.g. `"NOT_FOUND"`).
 * @returns An object with `throw` and `create` methods.
 *
 * @example
 * ```typescript
 * const errors = defineErrors({
 *   USER_NOT_FOUND: "NOT_FOUND",
 *   INVALID_INPUT: "BAD_REQUEST",
 * });
 *
 * // throws an AppError — return type is `never`
 * errors.throw("USER_NOT_FOUND", "No user with that id");
 *
 * // creates an AppError without throwing
 * const err = errors.create("INVALID_INPUT", "Email is required");
 *
 * // type guard — narrows to AppError<"USER_NOT_FOUND" | "INVALID_INPUT">
 * if (errors.is(someError)) { ... }
 * ```
 */
export function defineErrors<T extends string>(
  mapping: Record<T, StatusName>,
): {
  throw: (code: T, message: string, cause?: unknown) => never;
  create: (code: T, message: string, cause?: unknown) => AppError<T>;
  is: (err: unknown) => err is AppError<T>;
} {
  const resolved = {} as Record<T, number>;
  for (const [code, statusName] of Object.entries(mapping) as [T, StatusName][]) {
    resolved[code] = StatusCodes[statusName];
  }

  return {
    /**
     * Creates and immediately throws an `AppError`.
     *
     * @param code    One of the error codes defined in the mapping.
     * @param message Human-readable error message.
     * @param cause   Optional underlying cause.
     * @returns       Never — always throws.
     */
    throw: (code: T, message: string, cause?: unknown): never => {
      throw new AppError(code, resolved[code], message, cause);
    },

    /**
     * Creates an `AppError` without throwing it.
     *
     * @param code    One of the error codes defined in the mapping.
     * @param message Human-readable error message.
     * @param cause   Optional underlying cause.
     * @returns       A new `AppError` instance.
     */
    create: (code: T, message: string, cause?: unknown): AppError<T> =>
      new AppError(code, resolved[code], message, cause),

    /**
     * Type guard that narrows an unknown value to `AppError<T>`.
     *
     * @param err Any value to check.
     * @returns   `true` if `err` is an `AppError` instance.
     */
    is: (err: unknown): err is AppError<T> => err instanceof AppError,
  };
}
