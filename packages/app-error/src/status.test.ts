import { expect, test } from "bun:test";
import { type StatusCode, type StatusName, type StatusPhrase, status } from "./consts";
import { httpStatus } from "./status";

const testData = Object.entries(status).map(([code, [name, phrase]]) => ({
  code: Number(code) as StatusCode,
  name,
  phrase,
})) satisfies {
  code: StatusCode;
  name: StatusName;
  phrase: StatusPhrase;
}[];

test.each(testData)("lookup integrity for $name", ({ code, name, phrase }) => {
  expect(httpStatus.codeFromName(name)).toBe(code);
  expect(httpStatus.codeFromPhrase(phrase)).toBe(code);
  expect(httpStatus.nameFromCode(code)).toBe(name);
  expect(httpStatus.nameFromPhrase(phrase)).toBe(name);
  expect(httpStatus.phraseFromCode(code)).toBe(phrase);
  expect(httpStatus.phraseFromName(name)).toBe(phrase);
});
