import { describe, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import {
  Result,
  ResultAsync,
  type ResultAsync as ResultAsyncType,
  type Result as ResultType,
} from "./main";

const CUSTOM_ERROR_VALUE = 42;
const SUCCESS_VALUE = 3;
const DIVIDEND = 4;
const DIVISOR = 2;
const ZERO = 0;

class CustomError extends Error {
  readonly customField: number;
  constructor(customField: number, message: string) {
    super(message);
    this.name = "CustomField";
    this.customField = customField;
  }
}

function division(a: number, b: number): ResultType<number, Error> {
  if (b === 0) {
    return Result.err(new Error("cannot divide by zero"));
  }

  return Result.ok(a / b);
}

async function longRunning(shouldFail: boolean): ResultAsyncType<number, CustomError> {
  await setTimeout(1);

  if (shouldFail) {
    return ResultAsync.err(new CustomError(CUSTOM_ERROR_VALUE, "wrong"));
  }

  return ResultAsync.ok(SUCCESS_VALUE);
}

describe("default Error type", () => {
  test("ok result", () => {
    // act
    const result = division(DIVIDEND, DIVISOR);
    // assert
    assert(!result.isError);
    expect(result.value).toBe(2);
  });

  test("error result", () => {
    // act
    const result = division(DIVIDEND, ZERO);
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
    expect(result.value).toBe(SUCCESS_VALUE);
  });

  test("error result", async () => {
    //act
    const result = await longRunning(true);
    // assert
    assert(result.isError);
    expect(result.error).toBeInstanceOf(CustomError);
    expect(result.error.message).toBe("wrong");
    expect(result.error.customField).toBe(CUSTOM_ERROR_VALUE);
  });
});
