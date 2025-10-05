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

    /**
     * Retrieves random Agent-Verb-Patient combinations for a specific verb
     * 
     * @param verbId - The ID of the verb to get combinations for
     * @param isFitting - Whether to get correct (true) or incorrect (false) combinations
     * @param count - Number of combinations to return (default: 1)
     * @returns Promise<AgentVerbPatient_Trio[]> - Array of matching combinations
     */
    async GetRandomByVerbIdAndFitting(
        verbId:    number,
        isFitting: boolean,
        count:     number = 1
    ): Promise<AgentVerbPatient_Trio[]> {
        const all = await this.getAllByVerbId(verbId);
        const filtered = all.filter(e => e.isFitting === isFitting);
        return this.getRandomElements(filtered, count)
    }
}

export const avpTrioController = new AVPTrioController();