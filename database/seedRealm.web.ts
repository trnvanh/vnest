/**
 * Web-specific Realm seeding (No-op)
 * 
 * On web platform, data is loaded directly from JSON files via WebStorageAdapter.
 * No Realm seeding is needed.
 */
export async function seedRealm() {
  // No-op for web platform
  // Web uses WebStorageAdapter which loads data directly from JSON files
}