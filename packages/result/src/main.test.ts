import assert from "node:assert/strict";
import { setTimeout } from "node:timers/promises";
import { describe, expect, it, vi } from "vite-plus/test";
import {
  Result,
  ResultAsync,
  type ResultAsync as ResultAsyncType,
  type Result as ResultType,
} from "./main";

const CUSTOM_ERROR_VALUE = 42;
const DELAY_MS = 1;
const DIVIDEND = 4;
const DIVISOR = 2;
const QUOTIENT = 2;
const SUCCESS_VALUE = 3;
const ZERO = 0;

vi.setConfig({ testTimeout: 1000 });

class CustomError extends Error {
  public readonly customField: number;

  public constructor(customField: number, message: string) {
    super(message);
    this.name = "CustomError";
    this.customField = customField;
  }
}

function division(dividend: number, divisor: number): ResultType<number, Error> {
  if (divisor === ZERO) {
    return Result.err(new Error("cannot divide by zero"));
  }

  return Result.ok(dividend / divisor);
}

async function longRunning(shouldFail: boolean): ResultAsyncType<number, CustomError> {
  await setTimeout(DELAY_MS);

  if (shouldFail) {
    return ResultAsync.err(new CustomError(CUSTOM_ERROR_VALUE, "wrong"));
  }

  return ResultAsync.ok(SUCCESS_VALUE);
}

describe("default Error type", () => {
  it("ok result", () => {
    // Act
    expect.hasAssertions();
    const result = division(DIVIDEND, DIVISOR);
    // Assert
    assert(!result.isError);
    expect(result.value).toBe(QUOTIENT);
  });

  it("error result", () => {
    // Act
    expect.hasAssertions();
    const result = division(DIVIDEND, ZERO);
    // Assert
    assert(result.isError);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe("cannot divide by zero");
  });
});

describe("custom error", () => {
  it("ok result", async () => {
    // Act
    expect.hasAssertions();
    const result = await longRunning(false);
    // Assert
    assert(!result.isError);
    expect(result.value).toBe(SUCCESS_VALUE);
  });

  it("error result", async () => {
    // Act
    expect.hasAssertions();
    const result = await longRunning(true);
    // Assert
    assert(result.isError);
    expect(result.error).toBeInstanceOf(CustomError);
    expect(result.error.message).toBe("wrong");
    expect(result.error.customField).toBe(CUSTOM_ERROR_VALUE);
  });
});
