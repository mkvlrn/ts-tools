# @mkvlrn/app-error

Map your app's error codes to HTTP statuses. Define once, use everywhere, let TypeScript yell at you if you typo a code.

[![JSR Version](https://img.shields.io/jsr/v/%40mkvlrn/app-error)](https://jsr.io/@mkvlrn/app-error)

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add @mkvlrn/app-error@^0.1.0 # bun
pnpm add jsr:@mkvlrn/app-error # pnpm
yarn add jsr:@mkvlrn/app-error # yarn
deno add jsr:@mkvlrn/app-error # deno
npx jsr add @mkvlrn/app-error # npm
```

<!-- x-release-please-end -->

## API

| Export                  | What it does                                                                   |
| ----------------------- | ------------------------------------------------------------------------------ |
| `AppError<T>`           | Error subclass with `code`, `statusCode`, `status`, and a `serialize()` method |
| `defineErrors(mapping)` | Takes a code → status mapping, returns `throw`, `create`, and `is` helpers     |
| `InferAppError<T>`      | Extracts a qualified `AppError` type from a `defineErrors` result              |

## Usage

```ts
import { AppError, defineErrors } from "@mkvlrn/app-error";
```

### Define your errors

```ts
const errors = defineErrors({
  USER_NOT_FOUND: "NOT_FOUND", // 404
  INVALID_INPUT: "BAD_REQUEST", // 400
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED", // 401
});
```

Keys are your codes, values are status names from [http-status-codes](https://github.com/prettymuchbryce/http-status-codes). Both sides autocomplete.

### Throw or create

```ts
// throws — return type is never
errors.throw("USER_NOT_FOUND", "no user with that id");

// creates without throwing
const error = errors.create("INVALID_INPUT", "email is required");
error.code; // "INVALID_INPUT"
error.statusCode; // 400
error.status; // "Bad Request"
```

### Attach a cause

```ts
try {
  JSON.parse(rawBody);
} catch (cause) {
  errors.throw("INVALID_INPUT", "malformed json", cause);
}
```

### Serialize for responses

```ts
if (err instanceof AppError) {
  res.status(err.statusCode).json(err.serialize());
  // { code: "INVALID_INPUT", message: "email is required", details: undefined }
}
```

### Type guard

`errors.is()` narrows an unknown value to your qualified `AppError` type — useful in catch blocks and error filters:

```ts
if (errors.is(err)) {
  // err is AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">
  res.status(err.statusCode).json(err.serialize());
}
```

### Infer the qualified type

Instead of writing `AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | ...>` by hand, use `InferAppError` to extract it from your definition:

```ts
type MyAppError = InferAppError<typeof errors>;
// → AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">

function handleError(err: MyAppError) {
  // err.code is narrowed to the union — no generic to qualify manually
}
```

### Standalone (no mapping)

```ts
throw new AppError("CUSTOM_CODE", 503, "service unavailable");
```

## License

MIT
