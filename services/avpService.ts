import { agentController } from "@/controllers/AgentController";
import { avpTrioController } from "@/controllers/AVPTrioController";
import { patientController } from "@/controllers/PatientController";
import { verbController } from "@/controllers/VerbController";
import { Agent, Patient, Verb } from "@/database/schemas";

export interface WordBundle {
    verb: Verb;
    agents: Agent[];
    patients: Patient[];
}

export const avpService = {
    // Simplified random generation with different verbs
    GetRandomWordsForSet: async (setId: number): Promise<WordBundle | null> => {
        try {
            // Get all verbs and pick a random one
            const verbs = await verbController.getAll();
            if (verbs.length === 0) return null;
            
            const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
            
            // Get 3 random unique subjects
            const allAgents = await agentController.getAll();
            const shuffledAgents = [...allAgents].sort(() => Math.random() - 0.5);
            const selectedAgents = shuffledAgents.slice(0, 3);
            
            // Get 3 random unique objects
            const allPatients = await patientController.getAll();
            const shuffledPatients = [...allPatients].sort(() => Math.random() - 0.5);
            const selectedPatients = shuffledPatients.slice(0, 3);

            console.log(`Generated: Verb=${randomVerb.value}, Subjects=[${selectedAgents.map(a => a.value).join(', ')}], Objects=[${selectedPatients.map(p => p.value).join(', ')}]`);

            return { 
                verb: randomVerb, 
                agents: selectedAgents, 
                patients: selectedPatients 
            };
        } catch (error) {
            console.error('Error generating random words:', error);
            return null;
        }
    },

    GetWordsByVerbId: async (id: number): Promise<WordBundle | null> => {
        // For backward compatibility, but we'll prefer the new method
        return await avpService.GetRandomWordsForSet(1); // Default to set 1
    },

    IsCorrectCombination: async (agent: Agent, verb: Verb, patient: Patient): Promise<boolean> => {
        if (agent === null || verb === null || patient === null) return false;
        return avpTrioController.IsCorrentCombination(agent.id, verb.id, patient.id);
    }
};