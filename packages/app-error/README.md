# @mkvlrn/app-error

[![JSR](https://jsr.io/badges/@mkvlrn/app-error)](https://jsr.io/@mkvlrn/app-error) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Type-safe HTTP status utilities and application errors.

`@mkvlrn/app-error` provides two small, related APIs:

- HTTP status conversions between numeric codes, status names, and reason phrases.
- A single application-wide error definition that associates application error codes with HTTP statuses.

## TOC

- [Installation](#installation)
- [HTTP status](#http-status)
- [Application errors](#application-errors)
  - [Create errors](#create-errors)
  - [Throw errors](#throw-errors)
  - [Attach a cause](#attach-a-cause)
  - [Check errors](#check-errors)
  - [Infer the application error type](#infer-the-application-error-type)
  - [Serialize errors](#serialize-errors)
- [API](#api)
  - [`AppError<T>`](#apperrort)
  - [`AppError.define(mapping)`](#apperrordefinemapping)
  - [`httpStatus`](#httpstatus)
  - [`StatusCode`](#statuscode)
  - [`StatusName`](#statusname)
  - [`StatusPhrase`](#statusphrase)
- [License](#license)

## Installation

This package is hosted on [JSR](https://jsr.io/@mkvlrn/app-error) and is ESM only.

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add @mkvlrn/app-error@0.4.0 # bun
pnpm dlx jsr add @mkvlrn/app-error@0.4.0 # pnpm
yarn dlx jsr add @mkvlrn/app-error@0.4.0 # yarn
deno add jsr:@mkvlrn/app-error@0.4.0 # deno
npx jsr add @mkvlrn/app-error@0.4.0 # npm
```

<!-- x-release-please-end -->

## HTTP status

The `httpStatus` export provides type-safe conversions between HTTP status codes, names, and reason phrases.

```ts
import { httpStatus } from "@mkvlrn/app-error";

httpStatus.codeFromName("NotFound");
// 404

httpStatus.codeFromPhrase("Not Found");
// 404

httpStatus.nameFromCode(404);
// "NotFound"

httpStatus.nameFromPhrase("Not Found");
// "NotFound"

httpStatus.phraseFromCode(404);
// "Not Found"

httpStatus.phraseFromName("NotFound");
// "Not Found"
```

The package also exports the corresponding types:

```ts
import type { StatusCode, StatusName, StatusPhrase } from "@mkvlrn/app-error";

const code: StatusCode = 404;
const name: StatusName = "NotFound";
const phrase: StatusPhrase = "Not Found";
```

`httpStatus` can be used independently of `AppError`.

## Application errors

`AppError` is designed around a single application-wide error definition.

Instead of creating a separate class or type for every possible application error, define the application's complete error vocabulary in one place. Each error code is mapped to an HTTP status name.

```ts
import { AppError } from "@mkvlrn/app-error";

export const appErrors = AppError.define({
  resourceNotFound: "NotFound",
  externalApiError: "BadGateway",
  internalApiError: "InternalServerError",
});
```

Add new application errors to this mapping as the application grows. The resulting factory provides type-safe creation, throwing, and inspection of all errors defined by the application.

### Create errors

```ts
const error = appErrors.create("resourceNotFound", "The requested resource does not exist");

error.errorCode;
// "resourceNotFound"

error.statusCode;
// 404

error.statusName;
// "NotFound"

error.statusPhrase;
// "Not Found"
```

The error code is inferred from the keys of the mapping, so invalid codes are rejected by TypeScript:

```ts
appErrors.create("somethingElse", "This error code does not exist");
// Type error
```

### Throw errors

The same factory can throw an error directly:

```ts
appErrors.throw("resourceNotFound", "The requested resource does not exist");
```

`throw()` returns `never`, so it can be used naturally in functions that otherwise return a value.

### Attach a cause

An underlying error or additional failure context can be attached with `cause`:

```ts
try {
  await fetchSomething();
} catch (cause) {
  appErrors.throw("externalApiError", "The external service failed", cause);
}
```

The cause is available through the standard `Error.cause` property and is included as `details` when the error is serialized.

### Check errors

The factory provides a type guard for checking unknown values:

```ts
try {
  // ...
} catch (error) {
  if (appErrors.is(error)) {
    error.errorCode;
    error.statusCode;
    error.statusName;
    error.statusPhrase;
  }
}
```

The guard narrows the value to the application's complete `AppError` type.

For the example above, that type is:

```ts
AppError<"resourceNotFound" | "externalApiError" | "internalApiError">;
```

### Infer the application error type

If the aggregate application error type is needed elsewhere, it can be inferred directly from the factory:

```ts
export type AppErrorType = ReturnType<typeof appErrors.create>;
```

This produces:

```ts
AppError<"resourceNotFound" | "externalApiError" | "internalApiError">;
```

There is no need to declare or maintain separate types for individual errors.

### Serialize errors

`AppError.serialize()` converts an error into a plain object suitable for HTTP responses, logging, or other serialization:

```ts
const error = appErrors.create("resourceNotFound", "The requested resource does not exist");

error.serialize();
```

The result is:

```ts
{
  errorCode: "resourceNotFound",
  statusCode: 404,
  statusName: "NotFound",
  statusPhrase: "Not Found",
  message: "The requested resource does not exist",
  details: undefined,
}
```

For example, an HTTP handler can use the error's status directly:

```ts
if (appErrors.is(error)) {
  res.status(error.statusCode).json(error.serialize());
}
```

## API

### `AppError<T>`

An `Error` subclass containing:

- `errorCode` — application-specific error code.
- `statusCode` — numeric HTTP status code.
- `statusName` — HTTP status name.
- `statusPhrase` — HTTP reason phrase.
- `message` — human-readable error message.
- `cause` — optional underlying error or failure context.

`T` is the union of application error codes defined by `AppError.define()`.

The constructor is protected; errors should be created through a factory.

### `AppError.define(mapping)`

Creates an application error factory from an error-to-status mapping.

```ts
const appErrors = AppError.define({
  resourceNotFound: "NotFound",
  invalidInput: "BadRequest",
});
```

The mapping keys become the application's error codes, while the values are `StatusName` values.

The returned factory provides:

- `create(code, message, cause?)`
- `throw(code, message, cause?)`
- `is(value)`

### `httpStatus`

Provides conversions between:

- `StatusCode`
- `StatusName`
- `StatusPhrase`

All supported HTTP statuses are represented by the exported types.

### `StatusCode`

Union of all supported numeric HTTP status codes.

```ts
const code: StatusCode = 404;
```

### `StatusName`

Union of all supported HTTP status names.

```ts
const name: StatusName = "NotFound";
```

### `StatusPhrase`

Union of all supported HTTP reason phrases.

```ts
const phrase: StatusPhrase = "Not Found";
```

## License

MIT
