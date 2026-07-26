import { describe, expect, expectTypeOf, test } from "bun:test";
import assert from "node:assert/strict";
import { AppError, defineErrors, type InferAppError } from "./index";

const errors = defineErrors({
  USER_NOT_FOUND: "NOT_FOUND",
  INVALID_INPUT: "BAD_REQUEST",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED",
});

describe("AppError class", () => {
  test("creates an error with correct properties", () => {
    // act
    const error = new AppError("SOME_CODE", 404, "not found");
    // assert
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("AppError");
    expect(error.code).toBe("SOME_CODE");
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe("Not Found");
    expect(error.message).toBe("not found");
    expect(error.cause).toBeUndefined();
  });

  test("attaches an optional cause", () => {
    // arrange
    const cause = new Error("original");
    // act
    const error = new AppError("OOPS", 500, "wrapped", cause);
    // assert
    expect(error.cause).toBe(cause);
  });

  test("serialize returns a plain object", () => {
    // arrange
    const cause = { field: "email" };
    const error = new AppError("BAD", 400, "invalid email", cause);
    // act
    const serialized = error.serialize();
    // assert
    expect(serialized).toEqual({
      code: "BAD",
      message: "invalid email",
      details: cause,
    });
  });

  test("serialize returns undefined details when no cause", () => {
    // act
    const serialized = new AppError("X", 500, "boom").serialize();
    // assert
    expect(serialized.details).toBeUndefined();
  });
});

describe("defineErrors - create", () => {
  test("creates an AppError with the mapped status code", () => {
    // act
    const error = errors.create("USER_NOT_FOUND", "no such user");
    // assert
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("USER_NOT_FOUND");
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe("Not Found");
    expect(error.message).toBe("no such user");
  });

  test("creates an error with a different mapped code", () => {
    // act
    const error = errors.create("INVALID_INPUT", "missing field");
    // assert
    expect(error.code).toBe("INVALID_INPUT");
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe("Bad Request");
  });

  test("passes cause through to the created error", () => {
    // arrange
    const cause = new TypeError("unexpected type");
    // act
    const error = errors.create("INVALID_INPUT", "bad payload", cause);
    // assert
    expect(error.cause).toBe(cause);
  });
});

describe("defineErrors - throw", () => {
  test("throws an AppError with the mapped status code", () => {
    // act & assert
    expect(() => errors.throw("USER_NOT_FOUND", "gone")).toThrowError(AppError);
  });

  test("thrown error has correct properties", () => {
    // act & assert
    try {
      errors.throw("UNAUTHORIZED_ACCESS", "bad token");
      assert.fail("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError<string>).code).toBe("UNAUTHORIZED_ACCESS");
      expect((error as AppError<string>).statusCode).toBe(401);
      expect((error as AppError<string>).status).toBe("Unauthorized");
      expect((error as AppError<string>).message).toBe("bad token");
    }
  });

  test("thrown error includes cause", () => {
    // arrange
    const cause = "session expired";
    // act & assert
    try {
      errors.throw("UNAUTHORIZED_ACCESS", "re-authenticate", cause);
      assert.fail("should have thrown");
    } catch (error) {
      expect((error as AppError<string>).cause).toBe(cause);
    }
  });
});

describe("defineErrors - is", () => {
  test("returns true for an AppError created from the same mapping", () => {
    // arrange
    const error = errors.create("USER_NOT_FOUND", "gone");
    // assert
    expect(errors.is(error)).toBe(true);
  });

  test("returns true for a manually constructed AppError", () => {
    // arrange
    const error = new AppError("RANDOM", 500, "boom");
    // assert
    expect(errors.is(error)).toBe(true);
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

  test("narrows the type to AppError<TCode>", () => {
    // arrange
    const err: unknown = errors.create("INVALID_INPUT", "bad");
    // act & assert
    if (errors.is(err)) {
      expectTypeOf(err).toEqualTypeOf<
        AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">
      >();
    }
  });
});

describe("InferAppError", () => {
  test("inferred type matches the code union from the mapping", () => {
    // arrange
    type Inferred = InferAppError<typeof errors>;
    // assert
    expectTypeOf<Inferred>().toEqualTypeOf<
      AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">
    >();
  });

  test("inferred type is assignable from create result", () => {
    // arrange
    type Inferred = InferAppError<typeof errors>;
    const error = errors.create("USER_NOT_FOUND", "gone");
    // assert
    expectTypeOf(error).toExtend<Inferred>();
  });

  test("resolves to never for non-defineErrors shapes", () => {
    // assert
    expectTypeOf<InferAppError<string>>().toEqualTypeOf<never>();
    expectTypeOf<InferAppError<{ unrelated: true }>>().toEqualTypeOf<never>();
  });
});
