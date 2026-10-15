const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : true;

/**
 * Console wrapper that is silenced in production builds.
 * `__DEV__` is inlined at bundle time, so the production branches
 * compile down to no-ops.
 */
export const logger = {
  log: isDev ? console.log.bind(console) : () => {},
  warn: isDev ? console.warn.bind(console) : () => {},
  error: isDev ? console.error.bind(console) : () => {},
};
