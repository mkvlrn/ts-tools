import assert from "node:assert/strict";
import { describe, expect, expectTypeOf, it, vi } from "vite-plus/test";
import { AppError } from "./app-error";

const BAD_REQUEST_STATUS = 400;
const NOT_FOUND_STATUS = 404;
const UNAUTHORIZED_STATUS = 401;
const NON_ERROR_VALUE = 42;

const errors = AppError.define({
  invalidInput: "BadRequest",
  unauthorizedAccess: "Unauthorized",
  userNotFound: "NotFound",
});

vi.setConfig({
  testTimeout: 1000,
});

describe("appError class", () => {
  it("serialize returns a plain object", () => {
    // Arrange
    expect.hasAssertions();
    const error = errors.create("invalidInput", "invalid email", { field: "email" });
    // Act
    const serialized = error.serialize();
    // Assert
    expect(serialized).toStrictEqual({
      details: { field: "email" },
      errorCode: "invalidInput",
      message: "invalid email",
      statusCode: 400,
      statusName: "BadRequest",
      statusPhrase: "Bad Request",
    });
  });

  it("serialize returns undefined details when no cause", () => {
    // Act
    expect.hasAssertions();
    const serialized = errors.create("userNotFound", "boom").serialize();
    // Assert
    expect(serialized.details).toBeUndefined();
  });

  it("uses standard non-enumerable cause semantics", () => {
    // Arrange
    expect.hasAssertions();
    const cause = new Error("root cause");
    const error = errors.create("invalidInput", "invalid", cause);
    // Assert
    expect(error.cause).toBe(cause);
    expect(Object.prototype.propertyIsEnumerable.call(error, "cause")).toBe(false);
  });
});

describe("appError.define - create", () => {
  it("creates an AppError with the mapped status code", () => {
    // Act
    expect.hasAssertions();
    const error = errors.create("userNotFound", "no such user");
    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      errorCode: "userNotFound",
      message: "no such user",
      statusCode: NOT_FOUND_STATUS,
      statusName: "NotFound",
      statusPhrase: "Not Found",
    });
  });

  it("creates an error with a different mapped code", () => {
    // Act
    expect.hasAssertions();
    const error = errors.create("invalidInput", "missing field");
    // Assert
    expect(error.errorCode).toBe("invalidInput");
    expect(error.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(error.statusPhrase).toBe("Bad Request");
  });

  it("does not change when the original mapping is mutated", () => {
    // Arrange
    expect.hasAssertions();
    const mapping = { resource: "NotFound" as const };
    const factory = AppError.define(mapping);
    Object.assign(mapping, { resource: "BadGateway" });
    // Act
    const error = factory.create("resource", "resource missing");
    // Assert
    expect(error.statusName).toBe("NotFound");
    expect(error.statusCode).toBe(NOT_FOUND_STATUS);
  });

  it("passes cause through to the created error", () => {
    // Arrange
    expect.hasAssertions();
    const cause = new TypeError("unexpected type");
    // Act
    const error = errors.create("invalidInput", "bad payload", cause);
    // Assert
    expect(error.cause).toBe(cause);
  });
});

function captureThrown(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
}

describe("appError.define - throw", () => {
  it("throws an AppError with the mapped status code", () => {
    // Act & assert
    expect.hasAssertions();
    expect(() => errors.throw("userNotFound", "gone")).toThrow(AppError);
  });

  it("thrown error has correct properties", () => {
    // Act & assert
    expect.hasAssertions();
    const error = captureThrown(() => errors.throw("unauthorizedAccess", "bad token"));
    assert(errors.is(error));
    expect(error.errorCode).toBe("unauthorizedAccess");
    expect(error.statusCode).toBe(UNAUTHORIZED_STATUS);
    expect(error.statusPhrase).toBe("Unauthorized");
    expect(error.message).toBe("bad token");
  });

  it("thrown error includes cause", () => {
    // Arrange
    expect.hasAssertions();
    const cause = "session expired";
    // Act & assert
    const error = captureThrown(() => errors.throw("unauthorizedAccess", "re-authenticate", cause));
    assert(errors.is(error));
    expect(error.cause).toBe(cause);
  });
});

describe("appError.define - is", () => {
  it("returns true for an AppError created from the same mapping", () => {
    // Arrange
    expect.hasAssertions();
    const error = errors.create("userNotFound", "gone");
    // Assert
    assert(errors.is(error));
    expect(error).toBeInstanceOf(AppError);
  });

  it("returns false for an AppError from a different mapping", () => {
    // Arrange
    expect.hasAssertions();
    const otherErrors = AppError.define({ other: "BadGateway" });
    const error = otherErrors.create("other", "wrong mapping");
    // Assert
    expect(errors.is(error)).toBe(false);
  });

  it("returns false for an AppError with a different status mapping", () => {
    // Arrange
    expect.hasAssertions();
    const otherErrors = AppError.define({ userNotFound: "BadGateway" });
    const error = otherErrors.create("userNotFound", "wrong status");
    // Assert
    expect(errors.is(error)).toBe(false);
  });

  it("returns false for a plain Error", () => {
    // Assert
    expect.hasAssertions();
    expect(errors.is(new Error("nope"))).toBe(false);
  });

  it("returns false for non-error values", () => {
    // Assert
    expect.hasAssertions();
    expect(errors.is(undefined)).toBe(false);
    expect(errors.is(undefined)).toBe(false);
    expect(errors.is("string")).toBe(false);
    expect(errors.is(NON_ERROR_VALUE)).toBe(false);
    expect(errors.is({})).toBe(false);
  });

  it("narrows the type to AppError<T>", () => {
    // Arrange
    expect.hasAssertions();
    const err: unknown = errors.create("invalidInput", "bad");
    // Act & assert
    assert(errors.is(err));
    expect(err).toBeInstanceOf(AppError);
    if (errors.is(err)) {
      expectTypeOf(err).toEqualTypeOf<
        AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">
      >();
    }
  });
});

describe("appError type extraction", () => {
  it("inferred type matches the code union from the mapping", () => {
    // Arrange
    expect.hasAssertions();
    type Inferred = ReturnType<typeof errors.create>;
    // Assert
    expect(errors.create("invalidInput", "x").errorCode).toBe("invalidInput");
    expectTypeOf<Inferred>().toEqualTypeOf<
      AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">
    >();
  });

  it("inferred type is assignable from create result", () => {
    // Arrange
    expect.hasAssertions();
    type Inferred = ReturnType<typeof errors.create>;
    const error = errors.create("userNotFound", "gone");
    // Assert
    expect(error.errorCode).toBe("userNotFound");
    expectTypeOf(error).toExtend<Inferred>();
  });

  it("serialized error preserves the code union", () => {
    // Arrange
    expect.hasAssertions();
    const error = errors.create("userNotFound", "gone");
    // Assert
    expect(error.serialize().errorCode).toBe("userNotFound");
    expectTypeOf(error.serialize().errorCode).toEqualTypeOf<
      "userNotFound" | "invalidInput" | "unauthorizedAccess"
    >();
  });
});
