import { Key, pathToRegexp } from 'path-to-regexp';

export type RouteKey = {
  path: string;
  pattern: RegExp;
  params: Array<Key & { segmentIndex: number }>;
};

export type HandlerDescriptor<HandlerModule> = {
  module: HandlerModule;
  params: {
    segmentIndex: number;
    name: string | number;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }[];
};

export type HandlerMap<HandlerModule> = Map<
  RouteKey,
  HandlerDescriptor<HandlerModule>
>;

export default function loadHandlers<HandlerModule>(
  ctx: __WebpackModuleApi.RequireContext
): HandlerMap<HandlerModule> {
  let map = new Map<RouteKey, HandlerDescriptor<HandlerModule>>();
  ctx.keys().reduce((routeMap, file) => {
    // Skip the relative path references. require.context provides multiple
    // options for requiring the same file, we only want 1 reference per file
    if (file.startsWith('./')) {
      return routeMap;
    }
    // The path is the filepath minus the method and extension
    let [basename] = file.split('.');
    let gatewayUrl = '/api/' + basename;
    // Rewrite dynamic segments from /foo/[bar] (Next.js syntax) to /foo/:bar
    // (everyone else, including path-to-regexp)
    let rewrittenUrl = gatewayUrl.replace(/\[([^\]]+)\]/g, ':$1');
    let keys = [] as Key[];
    // Generate the regexp for this dynamic path
    let pathRegexp = pathToRegexp(rewrittenUrl, keys);
    // Augment the params with their segment index. Our gateway endpoint
    // effectively loses the information about which URL segment matches which
    // param, so we need to add the indexes here to rebuild it in the gateway.
    let segments = gatewayUrl.split('/');
    let params = keys.map(key => ({
      ...key,
      segmentIndex: segments.findIndex(segment => segment === `[${key.name}]`),
    }));
    // Save off the path regexp and the associated patterns
    routeMap.set(
      { path: rewrittenUrl, pattern: pathRegexp, params },
      { module: ctx(file) as HandlerModule, params }
    );
    return routeMap;
  }, map);
  return map;
}
