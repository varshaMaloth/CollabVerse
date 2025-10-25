// Minimal shim used on client build in place of @opentelemetry/context-async-hooks
// Export only what's needed to avoid runtime errors in client bundles.
// If your server-only code uses specific APIs from this package, they will still work on the server.
module.exports = {
  AsyncHooksContextManager: class {
    constructor() {}
    active() {}
    with() {}
    enable() {
      return this;
    }
    disable() {
      return this;
    }
  },
};
