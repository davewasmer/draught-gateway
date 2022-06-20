import { NextApiRequest, NextApiResponse } from 'next';
import { UrlNotRecognized } from './errors';
import { Handlers } from './index';
import isQuery from './is-query';
import formatError from './format-error';

export default function routeNotFound<HandlerModule>(
  req: NextApiRequest,
  res: NextApiResponse,
  handlers: Handlers<HandlerModule>
) {
  let availableHandlers = isQuery(req) ? handlers.queries : handlers.mutations;
  console.error(
    `No route matches ${req.url!}. Available ${
      isQuery(req) ? 'query' : 'mutation'
    } endpoints: \n -`,
    Array.from(availableHandlers.keys())
      .map(key => `${isQuery(req) ? 'GET' : 'POST'} ${key.path}`)
      .join('\n - ')
  );
  res.statusCode = 404;
  res.json(formatError(new UrlNotRecognized(req)));
  res.end();
}
