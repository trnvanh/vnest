import { avpTrioController_api } from "@/controllers/api_controllers/AVPTrioController";
import { IAVPTrioController } from "@/controllers/interfaces/IAVPTrioController";
import { agentController } from "@/controllers/realm_controllers/AgentController";
import { avpTrioController_realm } from "@/controllers/realm_controllers/AVPTrioController";
import { patientController } from "@/controllers/realm_controllers/PatientController";
import { verbController } from "@/controllers/realm_controllers/VerbController";
import { Agent, Patient, Verb } from "@/database/schemas";
import { Platform } from 'react-native';
import { WordBundle } from "./wordBundle";

const avpTrioController: IAVPTrioController = 
    Platform.OS === 'web' ? avpTrioController_api : avpTrioController_realm;

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
    },

    IsCorrectCombination: async (agent: Agent, verb: Verb, patient: Patient): Promise<boolean> => {
        if (agent === null || verb === null || patient === null) return false;
        return avpTrioController.IsCorrentCombination(agent.id, verb.id, patient.id);
    }
};