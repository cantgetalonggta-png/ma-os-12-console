/** Minimal no-op app-env Vite plugin for production desk. */
export function appEnvPlugin() {
  return {
    name: "app-builder:app-env-stub",
    config() {
      return {};
    },
  };
}
