import { type StatusCode, type StatusName, type StatusPhrase, status } from "./consts";

const codeByName = new Map<StatusName, StatusCode>();
const codeByPhrase = new Map<StatusPhrase, StatusCode>();
const nameByCode = new Map<StatusCode, StatusName>();
const phraseByCode = new Map<StatusCode, StatusPhrase>();

function isStatusCode(value: number): value is StatusCode {
  return Object.hasOwn(status, value);
}

for (const [key, [name, phrase]] of Object.entries(status)) {
  const code = Number(key);

  if (!isStatusCode(code)) {
    throw new RangeError(`Invalid HTTP status code: ${key}`);
  }

  codeByName.set(name, code);
  codeByPhrase.set(phrase, code);
  nameByCode.set(code, name);
  phraseByCode.set(code, phrase);
}

function lookup<Key, Value>(map: ReadonlyMap<Key, Value>, key: Key): Value {
  const value = map.get(key);

  if (value === undefined) {
    throw new RangeError(`Unknown HTTP status: ${String(key)}`);
  }

  return value;
}

/**
 * Shared `HttpStatus` conversion utility.
 *
 * Use this object to convert between HTTP status codes, names, and reason
 * phrases without manually maintaining lookup tables.
 *
 * All operations are constant-time lookups. Unknown inputs throw a `RangeError`.
 *
 *
 * @example
 * ```ts
 * import { httpStatus } from "./status";
 *
 * httpStatus.codeFromName("NotFound");
 * // => 404
 *
 * httpStatus.codeFromPhrase("Not Found");
 * // => 404
 *
 * httpStatus.nameFromCode(404);
 * // => "NotFound"
 *
 * httpStatus.nameFromPhrase("Not Found");
 * // => "NotFound"
 *
 * httpStatus.phraseFromCode(404);
 * // => "Not Found"
 *
 * httpStatus.phraseFromName("NotFound");
 * // => "Not Found"
 * ```
 */
export const httpStatus: Readonly<HttpStatus> = Object.freeze<HttpStatus>({
  codeFromName(name) {
    return lookup(codeByName, name);
  },

  codeFromPhrase(phrase) {
    return lookup(codeByPhrase, phrase);
  },

  nameFromCode(code) {
    return lookup(nameByCode, code);
  },

  nameFromPhrase(phrase) {
    return lookup(nameByCode, lookup(codeByPhrase, phrase));
  },

  phraseFromCode(code) {
    return lookup(phraseByCode, code);
  },

  phraseFromName(name) {
    return lookup(phraseByCode, lookup(codeByName, name));
  },
});

/**
 * Type-safe conversion utilities for HTTP status values.
 *
 * Provides constant-time conversions between:
 *
 * - `StatusCode` numeric HTTP status codes (for example, `404`)
 * - `StatusName` symbolic status names (for example, `"NotFound"`)
 * - `StatusPhrase` HTTP reason phrases (for example, `"Not Found"`)
 *
 * Every conversion only accepts valid HTTP status values defined by this package.
 *
 *
 * @example
 * ```ts
 * httpStatus.codeFromName("NotFound");
 * // => 404
 *
 * httpStatus.nameFromCode(404);
 * // => "NotFound"
 *
 * httpStatus.phraseFromCode(404);
 * // => "Not Found"
 * ```
 */
export interface HttpStatus {
  /**
   * Converts an HTTP status name into its numeric status code.
   *
   * @param name HTTP status name to convert.
   * @returns The corresponding numeric HTTP status code.
   *
   * @example
   * ```ts
   * httpStatus.codeFromName("NotFound");
   * // => 404
   * ```
   */
  codeFromName: (name: StatusName) => StatusCode;

  /**
   * Converts an HTTP reason phrase into its numeric status code.
   *
   * @param phrase HTTP reason phrase to convert.
   * @returns The corresponding numeric HTTP status code.
   *
   * @example
   * ```ts
   * httpStatus.codeFromPhrase("Not Found");
   * // => 404
   * ```
   */
  codeFromPhrase: (phrase: StatusPhrase) => StatusCode;

  /**
   * Converts a numeric HTTP status code into its status name.
   *
   * @param code HTTP status code to convert.
   * @returns The corresponding HTTP status name.
   *
   * @example
   * ```ts
   * httpStatus.nameFromCode(404);
   * // => "NotFound"
   * ```
   */
  nameFromCode: (code: StatusCode) => StatusName;

  /**
   * Converts an HTTP reason phrase into its status name.
   *
   * @param phrase HTTP reason phrase to convert.
   * @returns The corresponding HTTP status name.
   *
   * @example
   * ```ts
   * httpStatus.nameFromPhrase("Not Found");
   * // => "NotFound"
   * ```
   */
  nameFromPhrase: (phrase: StatusPhrase) => StatusName;

  /**
   * Converts a numeric HTTP status code into its reason phrase.
   *
   * @param code HTTP status code to convert.
   * @returns The corresponding HTTP reason phrase.
   *
   * @example
   * ```ts
   * httpStatus.phraseFromCode(404);
   * // => "Not Found"
   * ```
   */
  phraseFromCode: (code: StatusCode) => StatusPhrase;

  /**
   * Converts an HTTP status name into its reason phrase.
   *
   * @param name HTTP status name to convert.
   * @returns The corresponding HTTP reason phrase.
   *
   * @example
   * ```ts
   * httpStatus.phraseFromName("NotFound");
   * // => "Not Found"
   * ```
   */
  phraseFromName: (name: StatusName) => StatusPhrase;
}
