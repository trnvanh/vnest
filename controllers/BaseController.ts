import verbsJson from "@/assets/default_words/verbs.json";
import { getRealm } from "@/database/realm";

export abstract class BaseController<T> {
    protected isSeeded = false;
    abstract schemaName: string;
    abstract csvPath: string;

    protected async loadCSV(): Promise<any[]> {
        return verbsJson;
    }

    async seedIfNeeded(): Promise<void> {
        if (this.isSeeded) return;
        const realm = await getRealm();
        if (realm.objects(this.schemaName).length > 0) {
            this.isSeeded = true;
            return;
        }

        const rows = await this.loadCSV();
        
        realm.write(() => {
            rows.forEach(item => realm.create(this.schemaName, item));
        });

        this.isSeeded = true;
    }

    async getById(id: number): Promise<T | null> {
        await this.seedIfNeeded();
        const realm = await getRealm();
        const obj = realm.objectForPrimaryKey<T>(this.schemaName, id as any);
        return obj ?? null;
    }

    async getAll(): Promise<T[]> {
        await this.seedIfNeeded();
        const realm = await getRealm();
        return realm.objects<T>(this.schemaName).map(obj => ({ ...obj }));
    }
}