# @mkvlrn/result

[![JSR](https://jsr.io/badges/@mkvlrn/result)](https://jsr.io/@mkvlrn/result) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Dead simple Result pattern for TypeScript.

No `.map()`, no `.flatMap()`, no `.andThen()`, no `.orElse()`, no `.unwrap()`, no monadic gymnastics. Just two types with two functions. Then TypeScript does its thing.

## Why this one?

There are dozens of Result libraries for TypeScript. Nearly all of them bolt on method chaining, transformation pipelines, and functional programming utilities that turn a simple concept into an entire paradigm.

This package does **one thing**: gives you a type-safe `Result<T, E>` or `ResultAsync<T, E>` discriminated union with `okResult()` and `errResult()` constructors. You use `if/else` to handle it. TypeScript narrows the type for you. That's the whole API.

If you need `.map().flatMap().andThen().orElse().unwrapOr()` chains, use [neverthrow](https://github.com/supermacro/neverthrow) or [ts-results](https://github.com/vultix/ts-results). They're good libraries. This isn't that.

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add @mkvlrn/result@0.3.0 # bun
pnpm dlx jsr add @mkvlrn/result # pnpm
yarn dlx jsr add @mkvlrn/result # yarn
deno add jsr:@mkvlrn/result # deno
npx jsr add @mkvlrn/result # npm
```

<!-- x-release-please-end -->

## API

| Export              | What it does                                                                        |
| ------------------- | ----------------------------------------------------------------------------------- |
| `Result<T, E>`      | Synchronous Result type (`{ isError: false, value }` or `{ isError: true, error }`) |
| `ResultAsync<T, E>` | Asynchronous Result type (`Promise<Result<T, E>>`)                                  |
| `okResult(value)`   | Creates a successful Result object                                                  |
| `errResult(error)`  | Creates an error Result object                                                      |

That's it. That's the whole thing.

## Usage

```typescript
import { Result, ResultAsync, okResult, errResult } from "@mkvlrn/result";
```

### Create results, check results

```typescript
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return errResult(new Error("Division by zero"));
  }

  return okResult(a / b);
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
      return errResult(new Error(`HTTP ${response.status}`));
    }
    const user = await response.json();

    return okResult(user);
  } catch (error) {
    return errResult(error instanceof Error ? error : new Error("Unknown error"));
  }
}
```

`ResultAsync<T, E>` is just `Promise<Result<T, E>>`. It's a type alias.

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

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return errResult(new ValidationError(400, "bad-email"));
  }

  return okResult(email);
}

const result = validateEmail("invalid-email");
if (result.isError) {
  // TypeScript knows this is a ValidationError, not just Error
  console.log(`${result.error.code}:${result.error.message}`); // 400: bad-email
}
```

## License

MIT
