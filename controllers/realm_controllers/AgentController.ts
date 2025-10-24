import { Agent } from '../../database/schemas';
import { BaseController } from './BaseController';

export class AgentController extends BaseController<Agent> {
    schemaName =   'Agent';
    jsonFileName = 'agents';
}

export const agentController = new AgentController();