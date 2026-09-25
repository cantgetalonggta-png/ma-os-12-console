/** Minimal migration plan — no migrations for public desk. */
export function isMigrationFile(name) {
  return typeof name === "string" && /^\d+.*\.(sql|mjs|ts)$/.test(name);
}
export const pendingMigrations = [];
export default { isMigrationFile, pendingMigrations };
