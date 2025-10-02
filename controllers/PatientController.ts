import { Patient } from '../database/schemas';
import { BaseController } from './BaseController';

export class PatientController extends BaseController<Patient> {
    schemaName =   'Patient';
    jsonFileName = 'patients';
}

export const patientController = new PatientController();