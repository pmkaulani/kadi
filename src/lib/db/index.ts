import { IDatabaseAdapter } from './adapters/types';
import { MemoryDatabaseAdapter } from './adapters/memory-adapter';

// Global singleton instance for app lifecycle
let adapterInstance: IDatabaseAdapter | null = null;

export function getDbAdapter(): IDatabaseAdapter {
  if (!adapterInstance) {
    // If DATABASE_URL is set and a postgres client is configured, we could instantiate PostgresDatabaseAdapter here.
    // Otherwise, we use the MemoryDatabaseAdapter sandbox.
    adapterInstance = new MemoryDatabaseAdapter();
  }
  return adapterInstance;
}

/**
 * Resets the adapter instance (useful for clean test environments)
 */
export function resetDbAdapter(customAdapter?: IDatabaseAdapter): void {
  adapterInstance = customAdapter || new MemoryDatabaseAdapter();
}

export * from './types';
export * from './adapters/types';
