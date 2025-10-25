import { Verb } from '../../database/schemas';
import { BaseController } from './BaseController';

export class VerbController extends BaseController<Verb> {
    schemaName =   'Verb';
    jsonFileName = 'verbs';
}

export const verbController = new VerbController();