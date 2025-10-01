import { verbController } from "@/controllers/VerbController";
import { Verb } from "@/database/schemas";

export const verbService = {
    getVerbById: async (id: number): Promise<Verb | null> => {
        return verbController.getById(id);
    },

    getAllVerbs: async (): Promise<Verb[]> => {
        return verbController.getAll();
    }
};