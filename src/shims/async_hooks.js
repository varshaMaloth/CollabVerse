// Minimal shim for `async_hooks` so require('async_hooks') doesn't blow up if present.
// Keeps a few common functions to be harmless in the client.
module.exports = {
  createHook: () => ({
    enable() {},
    disable() {},
  }),
  AsyncLocalStorage: class {
    constructor() {}
    getStore() {}
    run() {}
    exit() {}
    enterWith() {}
  }
};
