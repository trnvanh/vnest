import { AgentVerbPatient_Trio } from '../database/schemas';
import { BaseController } from './BaseController';

export class AVPTrioController extends BaseController<AgentVerbPatient_Trio> {
    schemaName =   'AgentVerbPatient_Trio';
    jsonFileName = 'avp_trios';

    private async getAllByVerbId(verbId: number): Promise<AgentVerbPatient_Trio[]> {
        const all = await this.getAll();
        return all.filter(e => e.verbId == verbId);
    }

    private getRandomElements<T>(array: T[], count: number): T[] {
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    async GetRandomByVerbIdAndFitting(
        verbId:    number,
        isFitting: boolean,
        count:     number = 1
    ): Promise<AgentVerbPatient_Trio[]> {
        const all = await this.getAllByVerbId(verbId);
        const filtered = all.filter(e => e.isFitting === isFitting);
        return this.getRandomElements(filtered, count)
    }

    async IsCorrentCombination(
        agentId:   number,
        verbId:    number,
        patientId: number
    ): Promise<boolean> {
        const all = await this.getAllByVerbId(verbId);
        const filtered = all.filter(e => e.isFitting === true && e.agentId === agentId && e.patientId === patientId);
        return filtered.length >= 1;
    }
}

export const avpTrioController = new AVPTrioController();