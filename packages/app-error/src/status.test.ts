import assert from "node:assert/strict";
import { describe, expect, it, vi } from "vite-plus/test";
import { status } from "./consts";
import { httpStatus } from "./status";

vi.setConfig({
  testTimeout: 1000,
});

const testData = Object.entries(status).map(([code, [name, phrase]]) => ({
  code: Number(code),
  name,
  phrase,
}));

describe("http status utility", () => {
  it("keeps the shared status utility immutable", () => {
    expect.hasAssertions();
    expect(httpStatus).toBeTypeOf("object");
    assert(Object.isFrozen(httpStatus));
  });

  it.each(testData)("name and phrase lookups for $name", ({ code, name, phrase }) => {
    expect.hasAssertions();
    expect(httpStatus.codeFromName(name)).toBe(code);
    expect(httpStatus.nameFromPhrase(phrase)).toBe(name);
    expect(httpStatus.phraseFromName(name)).toBe(phrase);
  });

  it.each(testData)("code lookups for $name", ({ name, phrase }) => {
    expect.hasAssertions();
    const code = httpStatus.codeFromPhrase(phrase);
    expect(httpStatus.nameFromCode(code)).toBe(name);
    expect(httpStatus.phraseFromCode(code)).toBe(phrase);
  });
});
