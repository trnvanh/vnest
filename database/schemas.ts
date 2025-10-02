import { ObjectSchema } from 'realm';

export type Verb = {
    id:    number;
    value: string;
};

export type Agent = {
    id:    number;
    value: string;
};

export type Patient = {
    id:    number;
    value: string;
};

export type AgentVerbPatient_Trio = {
    id:        number;
    verbId:    number;
    agentId:   number;
    patientId: number;
    isFitting: boolean;
};


// Realm Schemas
export const VerbSchema: ObjectSchema = {
    name:       'Verb',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string'
    }
};

export const AgentSchema: ObjectSchema = {
    name:       'Agent',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string'
    }
};

export const PatientSchema: ObjectSchema = {
    name:       'Patient',
    primaryKey: 'id',
    properties: {
        id:     'int',
        value:  'string'
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
        isFitting: 'bool'
    }
};