import { ObjectSchema } from 'realm';

export type Verb = {
    id:    number;
    value: string;
    readonly type: "Verb";
};

export type Agent = {
    id:    number;
    value: string;
    readonly type: "Agent";
};

export type Patient = {
    id:    number;
    value: string;
    readonly type: "Patient";
};

export type AgentVerbPatient_Trio = {
    id:        number;
    verbId:    number;
    agentId:   number;
    patientId: number;
    isFitting: boolean;
    readonly type: "AgentVerbPatient_Trio";
};


// Realm Schemas
export const VerbSchema: ObjectSchema = {
    name:       'Verb',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string',
        type:   { type: 'string', default: 'Verb' }
    }
};

export const AgentSchema: ObjectSchema = {
    name:       'Agent',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string',
        type:   { type: 'string', default: 'Agent' }
    }
};

export const PatientSchema: ObjectSchema = {
    name:       'Patient',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string',
        type:   { type: 'string', default: 'Patient' }
    }
};

export const AgentVerbPatient_Trio_Schema: ObjectSchema = {
    name:          'AgentVerbPatient_Trio',
    primaryKey:    'id',
    properties: {
        id:        'int',
        agentId:   'int',
        verbId:    'int',
        patientId: 'int',
        isFitting: 'bool',
        type:      { type: 'string', default: 'AgentVerbPatient_Trio' }
    }
};