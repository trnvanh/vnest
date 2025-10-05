import { agentController } from "@/controllers/AgentController";
import { avpTrioController } from "@/controllers/AVPTrioController";
import { patientController } from "@/controllers/PatientController";
import { verbController } from "@/controllers/VerbController";
import { Agent, Patient } from "@/database/schemas";
import { WordBundle } from "./wordBundle";

export const avpService = {
    GetWordsByVerbId: async (id: number): Promise<WordBundle | null> => {
        const verb = await verbController.getById(id);
        if (!verb) return null;

        const [fitting] =      await avpTrioController.GetRandomByVerbIdAndFitting(id, true, 1);
        const not_fitting =    await avpTrioController.GetRandomByVerbIdAndFitting(id, false, 2);
        
        // Filter out undefined values
        const selected_trios = [fitting, ...not_fitting].filter(trio => trio !== undefined);
        
        if (selected_trios.length === 0) {
            console.warn(`No AVP trio data found for verbId: ${id}`);
            return null;
        }

        const agents: Agent[] = await Promise.all(
            selected_trios.map(async trio => {
                const agent = await agentController.getById(trio.agentId);
                return agent!;
            })
        )

        const patients: Patient[] = await Promise.all(
            selected_trios.map(async trio => {
                const patient = await patientController.getById(trio.patientId);
                return patient!;
            })
        )

        return { verb, agents, patients };
    }
};