# @mkvlrn/app-error

[![JSR](https://jsr.io/badges/@mkvlrn/app-error)](https://jsr.io/@mkvlrn/app-error) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Map your app's error codes to HTTP statuses. Define once, use everywhere, let TypeScript yell at you if you typo a code.

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add @mkvlrn/app-error@0.2.1 # bun
pnpm dlx jsr add @mkvlrn/app-error@0.2.1 # pnpm
yarn dlx jsr add @mkvlrn/app-error@0.2.1 # yarn
deno add jsr:@mkvlrn/app-error@0.2.1 # deno
npx jsr add @mkvlrn/app-error@0.2.1 # npm
```

<!-- x-release-please-end -->

## API

| Export              | What it does                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| `AppError<T>`       | Error subclass with `code`, `statusCode`, `status`, and `serialize()`                |
| `AppError.define()` | Static method taking a code to status mapping, returning `throw`, `create`, and `is` |

## Usage

```ts
import { AppError } from "@mkvlrn/app-error";
```

### Define your errors

```ts
const errors = AppError.define({
  USER_NOT_FOUND: "NOT_FOUND", // 404
  INVALID_INPUT: "BAD_REQUEST", // 400
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED", // 401
});
```

Keys are your codes, values are status names from [http-status-codes](https://github.com/prettymuchbryce/http-status-codes). Both sides autocomplete.

### Throw or create

```ts
// throws: return type is never
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

### Type guard

`errors.is()` narrows an unknown value to your qualified `AppError` type:

```ts
if (errors.is(err)) {
  // err is AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">
  res.status(err.statusCode).json(err.serialize());
}
```

### Infer the qualified type

Extract the `AppError` type using `ReturnType<typeof errors.create>`:

```ts
type MyAppError = ReturnType<typeof errors.create>;
// AppError<"USER_NOT_FOUND" | "INVALID_INPUT" | "UNAUTHORIZED_ACCESS">

function handleError(err: MyAppError) {
  // err.code is narrowed to the code union automatically
}
```

## License

MIT
