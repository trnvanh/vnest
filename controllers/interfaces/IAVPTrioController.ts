import { AgentVerbPatient_Trio } from "@/database/schemas";
import { IBaseController } from "./IBaseController";

export interface IAVPTrioController extends IBaseController<AgentVerbPatient_Trio> {
    GetRandomByVerbIdAndFitting(verbId: number, isFitting: boolean, count?: number): Promise<AgentVerbPatient_Trio[]>;
    IsCorrentCombination(agentId: number, verbId: number, patientId: number): Promise<boolean>;
}