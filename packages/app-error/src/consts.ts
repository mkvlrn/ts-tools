/**
 * Union of all supported HTTP status names.
 *
 * Status names are PascalCase identifiers such as `"OK"` and `"NotFound"`.
 *
 * @example
 * ```ts
 * const name: StatusName = "NotFound";
 * ```
 */
export type StatusName =
  | "Continue"
  | "SwitchingProtocols"
  | "Processing"
  | "EarlyHints"
  | "OK"
  | "Created"
  | "Accepted"
  | "NonAuthoritativeInformation"
  | "NoContent"
  | "ResetContent"
  | "PartialContent"
  | "MultiStatus"
  | "AlreadyReported"
  | "IMUsed"
  | "MultipleChoices"
  | "MovedPermanently"
  | "Found"
  | "SeeOther"
  | "NotModified"
  | "UseProxy"
  | "Unused"
  | "TemporaryRedirect"
  | "PermanentRedirect"
  | "BadRequest"
  | "Unauthorized"
  | "PaymentRequired"
  | "Forbidden"
  | "NotFound"
  | "MethodNotAllowed"
  | "NotAcceptable"
  | "ProxyAuthenticationRequired"
  | "RequestTimeout"
  | "Conflict"
  | "Gone"
  | "LengthRequired"
  | "PreconditionFailed"
  | "ContentTooLarge"
  | "URITooLong"
  | "UnsupportedMediaType"
  | "RangeNotSatisfiable"
  | "ExpectationFailed"
  | "ImATeapot"
  | "MisdirectedRequest"
  | "UnprocessableContent"
  | "Locked"
  | "FailedDependency"
  | "TooEarly"
  | "UpgradeRequired"
  | "PreconditionRequired"
  | "TooManyRequests"
  | "RequestHeaderFieldsTooLarge"
  | "UnavailableForLegalReasons"
  | "InternalServerError"
  | "NotImplemented"
  | "BadGateway"
  | "ServiceUnavailable"
  | "GatewayTimeout"
  | "HTTPVersionNotSupported"
  | "VariantAlsoNegotiates"
  | "InsufficientStorage"
  | "LoopDetected"
  | "NotExtended"
  | "NetworkAuthenticationRequired";

/**
 * Union of all supported numeric HTTP status codes.
 *
 * @example
 * ```ts
 * const code: StatusCode = 404;
 * ```
 */
export type StatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

/**
 * Union of all supported HTTP reason phrases.
 *
 * Reason phrases are human-readable strings such as `"OK"` and `"Not Found"`.
 *
 * @example
 * ```ts
 * const phrase: StatusPhrase = "Not Found";
 * ```
 */
export type StatusPhrase =
  | "Continue"
  | "Switching Protocols"
  | "Processing"
  | "Early Hints"
  | "OK"
  | "Created"
  | "Accepted"
  | "Non-Authoritative Information"
  | "No Content"
  | "Reset Content"
  | "Partial Content"
  | "Multi-Status"
  | "Already Reported"
  | "IM Used"
  | "Multiple Choices"
  | "Moved Permanently"
  | "Found"
  | "See Other"
  | "Not Modified"
  | "Use Proxy"
  | "Unused"
  | "Temporary Redirect"
  | "Permanent Redirect"
  | "Bad Request"
  | "Unauthorized"
  | "Payment Required"
  | "Forbidden"
  | "Not Found"
  | "Method Not Allowed"
  | "Not Acceptable"
  | "Proxy Authentication Required"
  | "Request Timeout"
  | "Conflict"
  | "Gone"
  | "Length Required"
  | "Precondition Failed"
  | "Content Too Large"
  | "URI Too Long"
  | "Unsupported Media Type"
  | "Range Not Satisfiable"
  | "Expectation Failed"
  | "I'm A Teapot"
  | "Misdirected Request"
  | "Unprocessable Content"
  | "Locked"
  | "Failed Dependency"
  | "Too Early"
  | "Upgrade Required"
  | "Precondition Required"
  | "Too Many Requests"
  | "Request Header Fields Too Large"
  | "Unavailable For Legal Reasons"
  | "Internal Server Error"
  | "Not Implemented"
  | "Bad Gateway"
  | "Service Unavailable"
  | "Gateway Timeout"
  | "HTTP Version Not Supported"
  | "Variant Also Negotiates"
  | "Insufficient Storage"
  | "Loop Detected"
  | "Not Extended"
  | "Network Authentication Required";

type Status = Record<StatusCode, readonly [StatusName, StatusPhrase]>;

export const status = {
  100: ["Continue", "Continue"],
  101: ["SwitchingProtocols", "Switching Protocols"],
  102: ["Processing", "Processing"],
  103: ["EarlyHints", "Early Hints"],
  200: ["OK", "OK"],
  201: ["Created", "Created"],
  202: ["Accepted", "Accepted"],
  203: ["NonAuthoritativeInformation", "Non-Authoritative Information"],
  204: ["NoContent", "No Content"],
  205: ["ResetContent", "Reset Content"],
  206: ["PartialContent", "Partial Content"],
  207: ["MultiStatus", "Multi-Status"],
  208: ["AlreadyReported", "Already Reported"],
  226: ["IMUsed", "IM Used"],
  300: ["MultipleChoices", "Multiple Choices"],
  301: ["MovedPermanently", "Moved Permanently"],
  302: ["Found", "Found"],
  303: ["SeeOther", "See Other"],
  304: ["NotModified", "Not Modified"],
  305: ["UseProxy", "Use Proxy"],
  306: ["Unused", "Unused"],
  307: ["TemporaryRedirect", "Temporary Redirect"],
  308: ["PermanentRedirect", "Permanent Redirect"],
  400: ["BadRequest", "Bad Request"],
  401: ["Unauthorized", "Unauthorized"],
  402: ["PaymentRequired", "Payment Required"],
  403: ["Forbidden", "Forbidden"],
  404: ["NotFound", "Not Found"],
  405: ["MethodNotAllowed", "Method Not Allowed"],
  406: ["NotAcceptable", "Not Acceptable"],
  407: ["ProxyAuthenticationRequired", "Proxy Authentication Required"],
  408: ["RequestTimeout", "Request Timeout"],
  409: ["Conflict", "Conflict"],
  410: ["Gone", "Gone"],
  411: ["LengthRequired", "Length Required"],
  412: ["PreconditionFailed", "Precondition Failed"],
  413: ["ContentTooLarge", "Content Too Large"],
  414: ["URITooLong", "URI Too Long"],
  415: ["UnsupportedMediaType", "Unsupported Media Type"],
  416: ["RangeNotSatisfiable", "Range Not Satisfiable"],
  417: ["ExpectationFailed", "Expectation Failed"],
  418: ["ImATeapot", "I'm A Teapot"],
  421: ["MisdirectedRequest", "Misdirected Request"],
  422: ["UnprocessableContent", "Unprocessable Content"],
  423: ["Locked", "Locked"],
  424: ["FailedDependency", "Failed Dependency"],
  425: ["TooEarly", "Too Early"],
  426: ["UpgradeRequired", "Upgrade Required"],
  428: ["PreconditionRequired", "Precondition Required"],
  429: ["TooManyRequests", "Too Many Requests"],
  431: ["RequestHeaderFieldsTooLarge", "Request Header Fields Too Large"],
  451: ["UnavailableForLegalReasons", "Unavailable For Legal Reasons"],
  500: ["InternalServerError", "Internal Server Error"],
  501: ["NotImplemented", "Not Implemented"],
  502: ["BadGateway", "Bad Gateway"],
  503: ["ServiceUnavailable", "Service Unavailable"],
  504: ["GatewayTimeout", "Gateway Timeout"],
  505: ["HTTPVersionNotSupported", "HTTP Version Not Supported"],
  506: ["VariantAlsoNegotiates", "Variant Also Negotiates"],
  507: ["InsufficientStorage", "Insufficient Storage"],
  508: ["LoopDetected", "Loop Detected"],
  510: ["NotExtended", "Not Extended"],
  511: ["NetworkAuthenticationRequired", "Network Authentication Required"],
} satisfies Status;
