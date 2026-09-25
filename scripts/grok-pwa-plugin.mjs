/** Minimal no-op PWA plugin for production desk. */
export function grokPwaPlugin() {
  return {
    name: "app-builder:grok-pwa-stub",
    config() {
      return {};
    },
  };
}
