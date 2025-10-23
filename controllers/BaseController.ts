import { database } from "@/database";

/**
 * Base controller for data management
 * 
 * Provides common functionality for all data controllers including:
 * - CRUD operations with type safety
 * - Cross-platform database abstraction
 * 
 * Each concrete controller specifies its schema name.
 */
export abstract class BaseController<T> {
    abstract schemaName: string;   // Database collection/table name

    /**
     * Retrieves a single item by ID
     * @param id - The ID of the item to retrieve
     * @returns The item or null if not found
     */
    async getById(id: number): Promise<T | null> {
        await database.initialize();
        return await database.findById<T>(this.schemaName, id);
    }

    /**
     * Retrieves all items in this collection
     * @returns Array of all items in the collection
     */
    async getAll(): Promise<T[]> {
        await database.initialize();
        return await database.query<T>(this.schemaName);
    }
}