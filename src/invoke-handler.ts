import { NextApiRequest, NextApiResponse } from 'next';
import { GatewayConfig } from './index';
import formatError from './format-error';
import { HandlerDescriptor } from './load-handlers';

export default async function invokeHandler<HandlerModule>(
  handler: HandlerDescriptor<HandlerModule>,
  req: NextApiRequest,
  res: NextApiResponse,
  executeRequest: GatewayConfig<HandlerModule>['executeRequest']
) {
  // Merge the params from the URL segments that we manually manage
  req.query = {
    ...req.query,
    ...handler.params.reduce((query, param) => {
      query[param.name] = req.query.gateway[param.segmentIndex];
      return query;
    }, {} as Record<string, any>),
  };

  // Run the endpoint handler
  let result: any;
  try {
    result = await executeRequest(handler, req, res);
  } catch (e) {
    res.json(formatError(e));
    res.end();
    return;
  }

  if (result == null) {
    res.end();
  } else {
    res.json(result);
  }
}
