import { type StatusCode, type StatusName, type StatusPhrase, status } from "./consts";

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

const codeByName = {} as Record<StatusName, StatusCode>;
const codeByPhrase = {} as Record<StatusPhrase, StatusCode>;
const nameByCode = {} as Record<StatusCode, StatusName>;
const phraseByCode = {} as Record<StatusCode, StatusPhrase>;

for (const [codeAsString, [name, phrase]] of Object.entries(status)) {
  const code = Number(codeAsString) as StatusCode;

  codeByName[name] = code;
  codeByPhrase[phrase] = code;
  nameByCode[code] = name;
  phraseByCode[code] = phrase;
}

/**
 * Shared `HttpStatus` conversion utility.
 *
 * Use this object to convert between HTTP status codes, names, and reason
 * phrases without manually maintaining lookup tables.
 *
 * All operations are constant-time lookups.
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
export const httpStatus: Readonly<HttpStatus> = {
  codeFromName(name) {
    return codeByName[name];
  },

  codeFromPhrase(phrase) {
    return codeByPhrase[phrase];
  },

  nameFromCode(code) {
    return nameByCode[code];
  },

  nameFromPhrase(phrase) {
    return nameByCode[codeByPhrase[phrase]];
  },

  phraseFromCode(code) {
    return phraseByCode[code];
  },

  phraseFromName(name) {
    return phraseByCode[codeByName[name]];
  },
};
