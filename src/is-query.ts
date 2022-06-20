import { NextApiRequest } from 'next';
import { HttpMethod } from './http-methods';

export default function isQuery(req: NextApiRequest) {
  return req.method === HttpMethod.Get;
}
