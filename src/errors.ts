import { NextApiRequest } from 'next';

export type ErrorPayload = {
  error: {
    /** The HTTP status code that most closely maps to this error */
    status: number;
    /** The string label for this error code, i.e. "InvalidCredentials" */
    code: string;
    /** The human readable description of what went wrong */
    description?: string;
    /** Arbitrary data payload that can be supplied at the throw site */
    details?: unknown;
    /** The error stack trace. */
    stack?: string;
  };
};

export class ApiError extends Error {
  status = 500;
  description?: string | (() => string);
  details?: Record<string, any>;

  constructor() {
    super('');
    this.message =
      typeof this.description === 'function'
        ? this.description()
        : this.description ?? '';
  }
}

export class InvalidCredentials extends ApiError {
  description = 'The credentials you supplied with this request are invalid.';
  status = 400;
}

export class Unauthorized extends ApiError {
  description = 'You must be properly authenticated to make this request';
  status = 401;
}

export class UnexpectedRequestBody extends ApiError {
  description =
    "This endpoint doesn't accept a request body, but you supplied one.";
  status = 400;
}

export class ResourceNotFound extends ApiError {
  description = (): string => `No such ${this.resource} found`;
  status = 404;
  constructor(public resource: string) {
    super();
  }
}

export class UrlNotRecognized extends ApiError {
  description = (): string => `${this.req.url!} is not a recognized endpoint.`;
  status = 404;
  constructor(public req: NextApiRequest) {
    super();
  }
}

export class InvalidRequestBody extends ApiError {
  description = 'The request body you supplied is incorrect.';
  status = 400;
}

export class Forbidden extends ApiError {
  description =
    'Your credentials were recognized, but you are not authorized to make that request.';
  status = 403;
}

export class UnsupportedAuthorizationScheme extends ApiError {
  description =
    'You made a request using an unrecognized authorization scheme.';
  status = 400;
}
