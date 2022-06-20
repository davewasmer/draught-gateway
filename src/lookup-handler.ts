import { NextApiRequest } from 'next';
import { HandlerMap } from './load-handlers';

export default function lookupHandler<HandlerModule>(
  req: NextApiRequest,
  handlerMap: HandlerMap<HandlerModule>
) {
  if (!req.url) {
    throw new Error('Request is missing url - this should never happen.');
  }
  let path = req.url.split('?')[0];
  for (let key of handlerMap.keys()) {
    if (key.pattern.test(path)) {
      return handlerMap.get(key);
    }
  }
}
