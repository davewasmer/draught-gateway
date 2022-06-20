import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import loadHandlers, { HandlerDescriptor, HandlerMap } from './load-handlers';
import makeGateway from './make-gateway';

export type GatewayConfig<HandlerModule> = {
  dir: string;
  executeRequest(
    this: void,
    handler: HandlerDescriptor<HandlerModule>,
    req: NextApiRequest,
    res: NextApiResponse
  ): unknown | Promise<unknown>;
};

export type Handlers<HandlerModule> = {
  queries: HandlerMap<HandlerModule>;
  mutations: HandlerMap<HandlerModule>;
};

export default function initializeGateway<HandlerModule>(
  config: GatewayConfig<HandlerModule>
): NextApiHandler {
  let handlers = {
    queries: loadHandlers<HandlerModule>(
      require.context(config.dir, true, /\.query\.ts/)
    ),
    mutations: loadHandlers<HandlerModule>(
      require.context(config.dir, true, /\.mutation\.ts/)
    ),
  };
  return makeGateway<HandlerModule>(handlers, config.executeRequest);
}
