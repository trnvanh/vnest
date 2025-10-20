import data from '@/assets/seeding_data/finnish_v1.json';
import { deleteFile } from 'realm';
import { getRealm } from "./realm";

export async function seedRealm() {
    deleteFile({ path: "default.realm" });
    console.log("Putting in data now")

    const realm = await getRealm();

    const agentMap =   new Map<string, number>();
    const patientMap = new Map<string, number>();

    let verbId = -1, agentId = -1, patientId = -1, trioId = -1;

    realm.write(() => {
        for (const entry of data) {
            const { verb, pairs } = entry;
            
            verbId++;
            realm.create("Verb", { 
                id:    verbId, 
                value: verb, 
                type:  "Verb" });

            for (const [agentValue, patientValue] of pairs) {

                if(!agentMap.has(agentValue)) {
                    agentId++;
                    agentMap.set(agentValue, agentId);
                    realm.create("Agent", {
                        id:    agentId,
                        value: agentValue,
                        type:  "Agent"});
                }

                if (!patientMap.has(patientValue)) {
                    patientId++;
                    patientMap.set(patientValue, patientId);
                    realm.create("Patient", {
                        id:    patientId,
                        value: patientValue,
                        type:  "Patient" });
                }

                trioId++;
                realm.create("AgentVerbPatient_Trio", { 
                    id:        trioId, 
                    verbId:    verbId, 
                    agentId:   agentMap.get(agentValue)!, 
                    patientId: patientMap.get(patientValue)!, 
                    isFitting: true, 
                    type:      "AgentVerbPatient_Trio" });
            }
        }
    });

    console.log("Application seeded data succesfully");
    console.log(`Added ${verbId} Verbs, ${agentId} distince Subjects and ${patientId} distinct Objects in ${trioId} pairs.`)
}