# @mkvlrn/result

Dead simple Result pattern for TypeScript.

No `.map()`, no `.flatMap()`, no `.andThen()`, no `.orElse()`, no `.unwrap()`, no monadic gymnastics. Just two types with two functions. Then TypeScript does its thing.

[![JSR Version](https://img.shields.io/jsr/v/%40mkvlrn/result)](https://jsr.io/@mkvlrn/result)

## Why this one?

There are dozens of Result libraries for TypeScript. Nearly all of them bolt on method chaining, transformation pipelines, and functional programming utilities that turn a simple concept into an entire paradigm.

This package does **one thing**: gives you a type-safe `ResultSync<T, E>` or `ResultAsync<T, E>` discriminated union with `ok()` and `err()` constructors. You use `if/else` to handle it. TypeScript narrows the type for you. That's the whole API.

**The entire implementation is ~35 lines. Zero runtime dependencies. Two exports.**

If you need `.map().flatMap().andThen().orElse().unwrapOr()` chains, use [neverthrow](https://github.com/supermacro/neverthrow) or [ts-results](https://github.com/vultix/ts-results). They're good libraries. This isn't that.

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

```bash
bunx jsr add -D @mkvlrn/result # bun
pnpm add -D jsr:@mkvlrn/result # pnpm
yarn add -D jsr:@mkvlrn/result # yarn
deno add -D jsr:@mkvlrn/result # deno
npx jsr add -D @mkvlrn/result # npm
```

## API

| Export              | What it does                                |
| ------------------- | ------------------------------------------- |
| `ResultSync<T, E>`  | Sync Result type and `{ ok, err }` helpers  |
| `ResultAsync<T, E>` | Async Result type and `{ ok, err }` helpers |

That's it. That's the whole thing.

## Usage

```typescript
import { ResultSync, ResultAsync } from "@mkvlrn/result";
```

### Create results, check results

```typescript
function divide(a: number, b: number): ResultSync<number, Error> {
  if (b === 0) {
    return ResultSync.err(new Error("Division by zero"));
  }

  return ResultSync.ok(a / b);
}

const result = divide(10, 2);
if (result.isError) {
  console.log(result.error.message); // Error - TypeScript knows
} else {
  console.log(result.value); // number - TypeScript knows
}
```

No `.unwrap()`, no `.expect()`, no other dozens of functions. You just use an `if` statement and the compiler handles the rest.

### Async Operations

```typescript
async function fetchUser(id: number): ResultAsync<User, Error> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return ResultAsync.err(new Error(`HTTP ${response.status}`));
    }
    const user = await response.json();

    return ResultAsync.ok(user);
  } catch (error) {
    return ResultAsync.err(error instanceof Error ? error : new Error("Unknown error"));
  }
}
```

`ResultAsync<T, E>` is just `Promise<ResultSync<T, E>>`. It's a type alias.

### Custom Error Types

```typescript
class ValidationError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
  }
}

function validateEmail(email: string): ResultSync<string, ValidationError> {
  if (!email.includes("@")) {
    return ResultSync.err(new ValidationError(400, "bad-email"));
  }

  return ResultSync.ok(email);
}

const result = validateEmail("invalid-email");
if (result.isError) {
  // TypeScript knows this is a ValidationError, not just Error
  console.log(`${result.error.code}:${result.error.message}`); // 400: bad-email
}
```

## License

MIT
