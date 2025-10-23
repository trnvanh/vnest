import agentsData from '@/assets/word_data/agents.json';
import avpTriosData from '@/assets/word_data/avp_trios.json';
import patientsData from '@/assets/word_data/patients.json';
import verbsData from '@/assets/word_data/verbs.json';
import { deleteFile } from 'realm';
import { getRealm } from "./realm";

export async function seedRealm() {
    deleteFile({ path: "default.realm" });

    const realm = await getRealm();

    realm.write(() => {
        // Insert Agents (subjects)
        for (const agent of agentsData) {
            realm.create("Agent", agent);
        }

        // Insert Verbs
        for (const verb of verbsData) {
            realm.create("Verb", verb);
        }

        // Insert Patients (objects)
        for (const patient of patientsData) {
            realm.create("Patient", patient);
        }

        // Insert AgentVerbPatient_Trio combinations
        for (const trio of avpTriosData) {
            realm.create("AgentVerbPatient_Trio", trio);
        }
    });
}