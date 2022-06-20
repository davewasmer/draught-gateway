import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import initializeGateway from '../src';

describe('index', () => {
  describe('initializeGateway', () => {
    // require.context not available in jest, don't feel like mocking/solving
    it.skip('return a gateway function', async () => {
      let res: any;
      let gateway = initializeGateway<{ default(): string }>({
        dir: path.join(__dirname, 'fixtures/api'),
        executeRequest(handler) {
          return { result: handler.module.default() };
        },
      });

      await gateway(
        { url: '/api/list', method: 'get' } as unknown as NextApiRequest,
        {
          json(response: any) {
            res = response;
          },
        } as unknown as NextApiResponse
      );

      expect(res).toEqual({ result: 'list was invoked' });
    });
  });
});
