import { type StatusCode, type StatusName, type StatusPhrase, status } from "./consts";

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
export const httpStatus = {
  /**
   * Returns the numeric HTTP status code for a status name.
   *
   * @example
   * ```ts
   * httpStatus.codeFromName("NotFound");
   * // => 404
   * ```
   */
  codeFromName(name: StatusName): StatusCode {
    return codeByName[name];
  },

  /**
   * Returns the numeric HTTP status code for a reason phrase.
   *
   * @example
   * ```ts
   * httpStatus.codeFromPhrase("Not Found");
   * // => 404
   * ```
   */
  codeFromPhrase(phrase: StatusPhrase): StatusCode {
    return codeByPhrase[phrase];
  },

  /**
   * Returns the status name for a numeric HTTP status code.
   *
   * @example
   * ```ts
   * httpStatus.nameFromCode(404);
   * // => "NotFound"
   * ```
   */
  nameFromCode(code: StatusCode): StatusName {
    return nameByCode[code];
  },

  /**
   * Returns the status name for a reason phrase.
   *
   * @example
   * ```ts
   * httpStatus.nameFromPhrase("Not Found");
   * // => "NotFound"
   * ```
   */
  nameFromPhrase(phrase: StatusPhrase): StatusName {
    return nameByCode[codeByPhrase[phrase]];
  },

  /**
   * Returns the reason phrase for a numeric HTTP status code.
   *
   * @example
   * ```ts
   * httpStatus.phraseFromCode(404);
   * // => "Not Found"
   * ```
   */
  phraseFromCode(code: StatusCode): StatusPhrase {
    return phraseByCode[code];
  },

  /**
   * Returns the reason phrase for a status name.
   *
   * @example
   * ```ts
   * httpStatus.phraseFromName("NotFound");
   * // => "Not Found"
   * ```
   */
  phraseFromName(name: StatusName): StatusPhrase {
    return phraseByCode[codeByName[name]];
  },
} as const;
