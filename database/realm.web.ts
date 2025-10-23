/**
 * Web-specific Realm configuration (No-op)
 * 
 * On web platform, we use WebStorageAdapter instead of Realm.
 * This file provides stub implementations to satisfy imports.
 */

// Mock realm configuration for web compatibility
export const realmConfig = {};

// Mock getRealm function for web compatibility
export const getRealm = async () => {
  throw new Error('Realm is not available on web platform. Use WebStorageAdapter instead.');
};