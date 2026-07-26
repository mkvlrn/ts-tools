import { describe, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import { ResultAsync, ResultSync } from "./index";

class CustomError extends Error {
  readonly customField: number;
  constructor(customField: number, message: string) {
    super(message);
    this.name = "CustomField";
    this.customField = customField;
  }
}

function division(a: number, b: number): ResultSync<number, Error> {
  if (b === 0) {
    return ResultSync.err(new Error("cannot divide by zero"));
  }

  return ResultSync.ok(a / b);
}

async function longRunning(shouldFail: boolean): ResultAsync<number, CustomError> {
  await setTimeout(1);

  if (shouldFail) {
    return ResultAsync.err(new CustomError(42, "wrong"));
  }

  return ResultAsync.ok(3);
}

describe("default Error type", () => {
  test("ok result", () => {
    // act
    const result = division(4, 2);
    // assert
    assert(!result.isError);
    expect(result.value).toBe(2);
  });

  test("error result", () => {
    // act
    const result = division(4, 0);
    // assert
    assert(result.isError);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe("cannot divide by zero");
  });
});

describe("custom error", () => {
  test("ok result", async () => {
    // act
    const result = await longRunning(false);
    // assert
    assert(!result.isError);
    expect(result.value).toBe(3);
  });

  test("error result", async () => {
    //act
    const result = await longRunning(true);
    // assert
    assert(result.isError);
    expect(result.error).toBeInstanceOf(CustomError);
    expect(result.error.message).toBe("wrong");
    expect(result.error.customField).toBe(42);
  });
});
