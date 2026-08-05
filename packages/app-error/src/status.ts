import { type StatusCode, type StatusName, type StatusPhrase, status } from "./consts";

/**
 * Type-safe conversion utilities between HTTP status codes, status names,
 * and reason phrases.
 *
 * All conversions are constant-time lookups and accept only valid HTTP
 * status values defined by this package.
 *
 * @example
 * ```ts
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
export interface HttpStatus {
  /**
   * Returns the numeric HTTP status code for a status name.
   *
   * @param name The HTTP status name to convert.
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
   * Returns the numeric HTTP status code for a reason phrase.
   *
   * @param phrase The HTTP reason phrase to convert.
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
   * Returns the status name for a numeric HTTP status code.
   *
   * @param code The HTTP status code to convert.
   * @returns The corresponding status name.
   *
   * @example
   * ```ts
   * httpStatus.nameFromCode(404);
   * // => "NotFound"
   * ```
   */
  nameFromCode: (code: StatusCode) => StatusName;

  /**
   * Returns the status name for a reason phrase.
   *
   * @param phrase The HTTP reason phrase to convert.
   * @returns The corresponding status name.
   *
   * @example
   * ```ts
   * httpStatus.nameFromPhrase("Not Found");
   * // => "NotFound"
   * ```
   */
  nameFromPhrase: (phrase: StatusPhrase) => StatusName;

  /**
   * Returns the reason phrase for a numeric HTTP status code.
   *
   * @param code The HTTP status code to convert.
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
   * Returns the reason phrase for a status name.
   *
   * @param name The HTTP status name to convert.
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
