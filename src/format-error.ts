import { ApiError, ErrorPayload } from './errors';

export default function formatError(e: unknown): ErrorPayload {
  if (e instanceof ApiError) {
    return {
      error: {
        status: e.status,
        code: e.name,
        description:
          typeof e.description === 'function' ? e.description() : e.description,
        details: e.details,
        stack: e.stack,
      },
    };
  }
  if (e instanceof Error) {
    return {
      error: {
        status: 500,
        code: e.name,
        description: e.message,
        stack: e.stack,
      },
    };
  }
  return {
    error: {
      status: 500,
      code: 'InternalServerError',
      description: `You threw a non-Error value: ${String(e)}`,
    },
  };
}
