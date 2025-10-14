import agents from "@/assets/default_words/agents.json";
import avp_trios from "@/assets/default_words/avp_trios.json";
import patients from "@/assets/default_words/patients.json";
import verbs from "@/assets/default_words/verbs.json";
import { getRealm } from "@/database/realm";
import Realm from "realm";

/**
 * JSON data mapping for static imports
 * 
 * Metro Bundler requires static import paths, so we use this mapping
 * to provide access to JSON files by filename key. This is used primarily
 * by native platforms that need fallback data loading when the adapter
 * doesn't handle seeding internally.
 */
export const jsonMap: Record<string, any> = {
    verbs, agents, patients, avp_trios
};

/**
 * Base controller for data management
 * 
 * Provides common functionality for all data controllers including:
 * - Cross-platform database initialization
 * - Automatic data seeding from JSON files
 * - CRUD operations with type safety
 * 
 * Each concrete controller specifies its schema name and JSON file name.
 */
export abstract class BaseController<T> {
    protected isSeeded = false;
    abstract schemaName: string;   // Database collection/table name
    abstract jsonFileName: string; // JSON file name (without extension)

    /**
     * Loads JSON data for this controller's collection
     * Used as fallback when database adapter doesn't handle seeding internally
     */
    protected async loadCSV(): Promise<any[]> {
        const data = jsonMap[this.jsonFileName];
        if (!data) {
            console.warn(`BaseController: No JSON data found for ${this.jsonFileName}`);
            return [];
        }
        return data;
    }

    /**
     * Ensures the database is initialized and seeded with data
     * 
     * This method handles the cross-platform data loading strategy:
     * 1. Initialize the database adapter (which may load data automatically)
     * 2. Check if data already exists (WebStorageAdapter seeds during init)
     * 3. If no data, fallback to loading from JSON files (for other adapters)
     */
    async seedIfNeeded(): Promise<void> {
        if (this.isSeeded) return;
        
        // Initialize the database adapter
        await database.initialize();
        
        // Check if data was already loaded during adapter initialization
        const existing = await database.query<T>(this.schemaName);
        
        if (existing.length > 0) {
            // Data already available (WebStorageAdapter seeds during initialization)
            this.isSeeded = true;
            return;
        }

        // Fallback: Load from JSON files if adapter didn't seed automatically
        const rows = await this.loadCSV();
        if (rows.length > 0) {
            console.log(`${this.schemaName}: Loading ${rows.length} records from ${this.jsonFileName}.json`);
            
            for (const item of rows) {
                await database.insert<T>(this.schemaName, item);
            }
        }

        realm.write(() => {
            rows.forEach(item => realm.create(this.schemaName, item, Realm.UpdateMode.Modified));
        });

        this.isSeeded = true;
    }

    /**
     * Retrieves a single item by ID
     * @param id - The ID of the item to retrieve
     * @returns The item or null if not found
     */
    async getById(id: number): Promise<T | null> {
        await this.seedIfNeeded();
        return await database.findById<T>(this.schemaName, id);
    }

    /**
     * Retrieves all items in this collection
     * @returns Array of all items in the collection
     */
    async getAll(): Promise<T[]> {
        await this.seedIfNeeded();
        return await database.query<T>(this.schemaName);
    }
}