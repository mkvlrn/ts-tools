import { describe, expect, expectTypeOf, test } from "bun:test";
import assert from "node:assert/strict";
import { AppError } from "./app-error";

const errors = AppError.define({
  userNotFound: "NotFound",
  invalidInput: "BadRequest",
  unauthorizedAccess: "Unauthorized",
});

describe("AppError class", () => {
  test("serialize returns a plain object", () => {
    // arrange
    const error = errors.create("invalidInput", "invalid email", { field: "email" });
    // act
    const serialized = error.serialize();
    // assert
    expect(serialized).toEqual({
      errorCode: "invalidInput",
      statusCode: 400,
      statusName: "BadRequest",
      statusPhrase: "Bad Request",
      message: "invalid email",
      details: { field: "email" },
    });
  });

  test("serialize returns undefined details when no cause", () => {
    // act
    const serialized = errors.create("userNotFound", "boom").serialize();
    // assert
    expect(serialized.details).toBeUndefined();
  });

  test("uses standard non-enumerable cause semantics", () => {
    // arrange
    const cause = new Error("root cause");
    const error = errors.create("invalidInput", "invalid", cause);
    // assert
    expect(error.cause).toBe(cause);
    expect(Object.prototype.propertyIsEnumerable.call(error, "cause")).toBe(false);
  });
});

describe("AppError.define - create", () => {
  test("creates an AppError with the mapped status code", () => {
    // act
    const error = errors.create("userNotFound", "no such user");
    // assert
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("AppError");
    expect(error.errorCode).toBe("userNotFound");
    expect(error.statusCode).toBe(404);
    expect(error.statusPhrase).toBe("Not Found");
    expect(error.message).toBe("no such user");
    expect(error.cause).toBeUndefined();
  });

  test("creates an error with a different mapped code", () => {
    // act
    const error = errors.create("invalidInput", "missing field");
    // assert
    expect(error.errorCode).toBe("invalidInput");
    expect(error.statusCode).toBe(400);
    expect(error.statusPhrase).toBe("Bad Request");
  });

  test("does not change when the original mapping is mutated", () => {
    // arrange
    const mapping = { resource: "NotFound" as const };
    const factory = AppError.define(mapping);
    Object.assign(mapping, { resource: "BadGateway" });
    // act
    const error = factory.create("resource", "resource missing");
    // assert
    expect(error.statusName).toBe("NotFound");
    expect(error.statusCode).toBe(404);
  });

  test("passes cause through to the created error", () => {
    // arrange
    const cause = new TypeError("unexpected type");
    // act
    const error = errors.create("invalidInput", "bad payload", cause);
    // assert
    expect(error.cause).toBe(cause);
  });
});

describe("AppError.define - throw", () => {
  test("throws an AppError with the mapped status code", () => {
    // act & assert
    expect(() => errors.throw("userNotFound", "gone")).toThrowError(AppError);
  });

  test("thrown error has correct properties", () => {
    // act & assert
    try {
      errors.throw("unauthorizedAccess", "bad token");
      assert.fail("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError<string>).errorCode).toBe("unauthorizedAccess");
      expect((error as AppError<string>).statusCode).toBe(401);
      expect((error as AppError<string>).statusPhrase).toBe("Unauthorized");
      expect((error as AppError<string>).message).toBe("bad token");
    }
  });

  test("thrown error includes cause", () => {
    // arrange
    const cause = "session expired";
    // act & assert
    try {
      errors.throw("unauthorizedAccess", "re-authenticate", cause);
      assert.fail("should have thrown");
    } catch (error) {
      expect((error as AppError<string>).cause).toBe(cause);
    }
  });
});

describe("AppError.define - is", () => {
  test("returns true for an AppError created from the same mapping", () => {
    // arrange
    const error = errors.create("userNotFound", "gone");
    // assert
    expect(errors.is(error)).toBe(true);
  });

  test("returns false for an AppError from a different mapping", () => {
    // arrange
    const otherErrors = AppError.define({ other: "BadGateway" });
    const error = otherErrors.create("other", "wrong mapping");
    // assert
    expect(errors.is(error)).toBe(false);
  });

  test("returns false for an AppError with a different status mapping", () => {
    // arrange
    const otherErrors = AppError.define({ userNotFound: "BadGateway" });
    const error = otherErrors.create("userNotFound", "wrong status");
    // assert
    expect(errors.is(error)).toBe(false);
  });

  test("returns false for a plain Error", () => {
    // assert
    expect(errors.is(new Error("nope"))).toBe(false);
  });

  test("returns false for non-error values", () => {
    // assert
    expect(errors.is(null)).toBe(false);
    expect(errors.is(undefined)).toBe(false);
    expect(errors.is("string")).toBe(false);
    expect(errors.is(42)).toBe(false);
    expect(errors.is({})).toBe(false);
  });

  test("narrows the type to AppError<T>", () => {
    // arrange
    const err: unknown = errors.create("invalidInput", "bad");
    // act & assert
    if (errors.is(err)) {
      expectTypeOf(err).toEqualTypeOf<
        AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">
      >();
    }
  });
});

describe("AppError type extraction", () => {
  test("inferred type matches the code union from the mapping", () => {
    // arrange
    type Inferred = ReturnType<typeof errors.create>;
    // assert
    expectTypeOf<Inferred>().toEqualTypeOf<
      AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">
    >();
  });

  test("inferred type is assignable from create result", () => {
    // arrange
    type Inferred = ReturnType<typeof errors.create>;
    const error = errors.create("userNotFound", "gone");
    // assert
    expectTypeOf(error).toExtend<Inferred>();
  });

  test("serialized error preserves the code union", () => {
    // arrange
    const error = errors.create("userNotFound", "gone");
    // assert
    expectTypeOf(error.serialize().errorCode).toEqualTypeOf<
      "userNotFound" | "invalidInput" | "unauthorizedAccess"
    >();
  });
});
