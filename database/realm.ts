import Realm from 'realm';

import {
    AgentSchema,
    AgentVerbPatient_Trio_Schema,
    PatientSchema,
    VerbSchema
} from './schemas';

let realmInstance: Realm | null = null;

export const realmConfig: Realm.Configuration = {
    schema: [AgentSchema, VerbSchema, PatientSchema, AgentVerbPatient_Trio_Schema]
};

export const getRealm = async (): Promise<Realm> => {
    if (!realmInstance) {
        realmInstance = await Realm.open(realmConfig);
    }
    return realmInstance;
}