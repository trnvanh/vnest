import agents from "@/assets/default_words/agents.json";
import avp_trios from "@/assets/default_words/avp_trios.json";
import patients from "@/assets/default_words/patients.json";
import verbs from "@/assets/default_words/verbs.json";
import { getRealm } from "@/database/realm";

// Unelegant, but Metro Bundler does not allow for dynamic paths in finding the jsons.
export const jsonMap: Record<string, any> = {
    verbs, agents, patients, avp_trios
};

export abstract class BaseController<T> {
    protected isSeeded =    false;
    abstract  schemaName:   string;
    abstract  jsonFileName: string;

    protected async loadCSV(): Promise<any[]> {
        const data = jsonMap[this.jsonFileName];
        if (!data) {
            console.warn(`No JSON found for ${this.jsonFileName}`);
            return [];
        }
        return data;
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
        const obj =   realm.objectForPrimaryKey<T>(this.schemaName, id as any);
        return obj ?? null;
    }

    async getAll(): Promise<T[]> {
        await this.seedIfNeeded();
        const realm = await getRealm();
        return realm.objects<T>(this.schemaName).map(obj => ({ ...obj }));
    }
}