import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { HttpMethod } from './http-methods';
import { Handlers, GatewayConfig } from './index';
import isQuery from './is-query';
import lookupHandler from './lookup-handler';
import invokeHandler from './invoke-handler';
import routeNotFound from './route-not-found';

export default function makeGateway<HandlerModule>(
  handlers: Handlers<HandlerModule>,
  executeRequest: GatewayConfig<HandlerModule>['executeRequest']
): NextApiHandler {
  return async function gateway(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    if (!req.url) {
      throw new Error('Missing req.url, this should not be possible');
    }
    if (
      !req.method ||
      ![HttpMethod.Get, HttpMethod.Post].includes(req.method as HttpMethod)
    ) {
      res.status(405).end();
      return;
    }

    let handler = lookupHandler(
      req,
      isQuery(req) ? handlers.queries : handlers.mutations
    );

    if (!handler) {
      return routeNotFound(req, res, handlers);
    }

    await invokeHandler(handler, req, res, executeRequest);
  };
}
