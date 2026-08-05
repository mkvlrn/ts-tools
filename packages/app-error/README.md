# @mkvlrn/app-error

[![JSR](https://jsr.io/badges/@mkvlrn/app-error)](https://jsr.io/@mkvlrn/app-error) [![Bun](https://badgen.net/badge/icon/it's%20better%20than%20node?icon=bun&label=bun&color=black)](https://bun.com)

Type-safe HTTP status lookups and application error factories.

Define your application's error mapping once, then create, throw, serialize, and inspect errors without repeating HTTP status codes. The package also exports standalone HTTP status lookup utilities.

## Installation

> [!NOTE]
> This package is hosted at [jsr](https://jsr.io) and is ESM **only**.

<!-- x-release-please-start-version -->

```bash
bunx jsr add @mkvlrn/app-error@0.3.6 # bun
pnpm dlx jsr add @mkvlrn/app-error@0.3.6 # pnpm
yarn dlx jsr add @mkvlrn/app-error@0.3.6 # yarn
deno add jsr:@mkvlrn/app-error@0.3.6 # deno
npx jsr add @mkvlrn/app-error@0.3.6 # npm
```

<!-- x-release-please-end -->

## API

| Export              | Description                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `AppError<T>`       | Error subclass carrying an application-specific error code together with its HTTP status information. |
| `AppError.define()` | Creates typed `create`, `throw`, and `is` helpers from an error-to-status mapping.                    |
| `httpStatus`        | Constant-time conversion utilities between HTTP status codes, names, and reason phrases.              |
| `StatusCode`        | Union of all supported HTTP status codes.                                                             |
| `StatusName`        | Union of all supported HTTP status names (e.g. `"NotFound"`).                                         |
| `StatusPhrase`      | Union of all supported HTTP reason phrases (e.g. `"Not Found"`).                                      |

## HTTP status lookups

The `httpStatus` export can be used independently of `AppError`.

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

All lookups are constant-time and fully type-safe.

## Usage

```ts
import { AppError } from "@mkvlrn/app-error";
```

### Define your errors

```ts
const errors = AppError.define({
  userNotFound: "NotFound",
  invalidInput: "BadRequest",
  unauthorizedAccess: "Unauthorized",
});
```

Keys are your application's error codes. Values are HTTP status names.

### Throw or create

```ts
// throws: return type is never
errors.throw("userNotFound", "No user with that id");

// creates without throwing
const err = errors.create("invalidInput", "Email is required");

err.errorCode;
// "invalidInput"

err.statusCode;
// 400

err.statusName;
// "BadRequest"

err.statusPhrase;
// "Bad Request"
```

### Attach a cause

```ts
try {
  JSON.parse(rawBody);
} catch (cause) {
  errors.throw("invalidInput", "Malformed JSON", cause);
}
```

### Serialize for responses

```ts
if (err instanceof AppError) {
  res.status(err.statusCode).json(err.serialize());
}
```

Produces:

```json
{
  "errorCode": "invalidInput",
  "statusCode": 400,
  "statusName": "BadRequest",
  "statusPhrase": "Bad Request",
  "message": "Email is required",
  "details": null
}
```

### Type guard

`errors.is()` narrows an unknown value to your qualified `AppError` type:

```ts
if (errors.is(err)) {
  // err is AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">
  res.status(err.statusCode).json(err.serialize());
}
```

### Infer the qualified type

Extract the `AppError` type using `ReturnType<typeof errors.create>`:

```ts
type MyAppError = ReturnType<typeof errors.create>;
// AppError<"userNotFound" | "invalidInput" | "unauthorizedAccess">

function handleError(err: MyAppError) {
  // err.errorCode is narrowed automatically
}
```

## License

MIT
