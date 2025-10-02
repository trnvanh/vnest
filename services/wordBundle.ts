import { Agent, Patient, Verb } from "@/database/schemas";

export interface WordBundle {
    verb: Verb;
    agents: Agent[];
    patients: Patient[];
}