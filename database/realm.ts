import Realm from 'realm';

import {
    AgentSchema,
    AgentVerbPatient_Trio_Schema,
    PatientSchema,
    VerbSchema
} from './schemas';

export const realmConfig: Realm.Configuration = {
    schema: [AgentSchema, VerbSchema, PatientSchema, AgentVerbPatient_Trio_Schema]
};

export const getRealm = async (): Promise<Realm> => {
    return await Realm.open(realmConfig);
}