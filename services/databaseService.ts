/**
 * Database Service for VN-EST App
 * 
 * This service provides a unified interface for managing Finnish language learning data.
 * It handles verbs, agents (subjects), patients (objects), and their combinations
 * to create meaningful Finnish sentence exercises.
 * 
 * Key Features:
 * - Set management: Maps learning sets to specific verbs
 * - Word combination validation: Checks if agent-verb-patient combinations are grammatically correct
 * - Data aggregation: Combines data from multiple controllers into structured learning content
 * 
 * Data Structure:
 * - Agents: Finnish pronouns and nouns (minä, sinä, hän, opettaja, etc.)
 * - Verbs: Common Finnish verbs in first person form (luen, kirjoitan, syön, etc.)
 * - Patients: Objects in correct Finnish case forms (kirjan, ruokaa, vettä, etc.)
 * - AVP Trios: Valid combinations of Agent-Verb-Patient for sentence construction
 */

import { agentController } from '@/controllers/AgentController';
import { avpTrioController } from '@/controllers/AVPTrioController';
import { patientController } from '@/controllers/PatientController';
import { verbController } from '@/controllers/VerbController';
import { Agent, Patient, Verb } from '@/database/schemas';
import { avpService } from './avpService';

/**
 * Structure for word data used in Finnish language exercises
 */
export interface DatabaseWordData {
  verbs: Verb[];              // All available Finnish verbs
  subjects: Agent[];          // All available subjects/agents (pronouns, nouns)
  objects: Patient[];         // All available objects/patients (in correct case forms)
  currentVerb: Verb | null;   // The verb currently being practiced
  currentCombinations: {      // Pre-calculated correct and incorrect combinations
    correct: { subject: Agent; object: Patient };
    incorrect: { subject: Agent; object: Patient }[];
  } | null;
}

/**
 * Main database service class for managing Finnish language learning data
 */
class DatabaseService {
  private currentVerbId: number = 0; // Start with verbId 0 ("luen" - reading exercises)
  private currentSetId: number = 1;  // Current learning set (1-6)

  async initialize(): Promise<void> {
    console.log('Initializing database service...');
    // Controllers will handle seeding automatically
  }

  async getAllVerbs(): Promise<Verb[]> {
    return await verbController.getAll();
  }

  async getAllSubjects(): Promise<Agent[]> {
    return await agentController.getAll();
  }

  async getAllObjects(): Promise<Patient[]> {
    return await patientController.getAll();
  }

  async setCurrentVerb(verbId: number): Promise<void> {
    this.currentVerbId = verbId;
  }

  async getCurrentVerb(): Promise<Verb | null> {
    return await verbController.getById(this.currentVerbId);
  }

  async setCurrentSet(setId: number): Promise<void> {
    this.currentSetId = setId;
    // Map sets to verbIds - now we have data for all verbs (0-5)
    const verbIdMap: { [key: number]: number } = {
      1: 0, // Set 1: "luen" (reading exercises)
      2: 1, // Set 2: "kirjoitan" (writing exercises)
      3: 2, // Set 3: "ostan" (buying exercises)
      4: 3, // Set 4: "syön" (eating exercises)
      5: 4, // Set 5: "juon" (drinking exercises)
      6: 5, // Set 6: "kuuntelen" (listening exercises)
    };
    this.currentVerbId = verbIdMap[setId] || 0; // Default to 0 if setId not found
  }

  async getCurrentWordBundle() {
    return await avpService.GetWordsByVerbId(this.currentVerbId);
  }

  async getWordDataForCurrentVerb(): Promise<DatabaseWordData> {
    const [verbs, subjects, objects, currentVerb] = await Promise.all([
      this.getAllVerbs(),
      this.getAllSubjects(),
      this.getAllObjects(),
      this.getCurrentVerb()
    ]);

    let currentCombinations = null;
    
    if (currentVerb) {
      const wordBundle = await this.getCurrentWordBundle();
      if (wordBundle) {
        currentCombinations = {
          correct: {
            subject: wordBundle.agents[0], // First agent is the fitting one
            object: wordBundle.patients[0] // First patient is the fitting one
          },
          incorrect: wordBundle.agents.slice(1).map((agent, index) => ({
            subject: agent,
            object: wordBundle.patients[index + 1] || wordBundle.patients[1]
          }))
        };
      }
    }

    return {
      verbs,
      subjects,
      objects,
      currentVerb,
      currentCombinations
    };
  }

  /**
   * Validates if a subject-verb-object combination is grammatically correct in Finnish
   * 
   * @param subject - The subject/agent (e.g., "minä", "sinä", "opettaja")
   * @param verb - The verb (e.g., "luen", "syön", "ostan")
   * @param object - The object/patient in correct case (e.g., "kirjan", "ruokaa", "auton")
   * @returns Promise<boolean> - true if the combination is valid Finnish grammar
   */
  async isCorrectCombination(subject: string, verb: string, object: string): Promise<boolean> {
    // Find the verb ID from the database
    const verbObj = await verbController.getAll().then(verbs => 
      verbs.find(v => v.value.toLowerCase() === verb.toLowerCase())
    );
    
    if (!verbObj) {
      return false;
    }

    // Get all valid (fitting) combinations for this verb
    const fittingTrios = await avpTrioController.GetRandomByVerbIdAndFitting(verbObj.id, true, 10);
    
    // Check if the user's combination matches any valid trio
    for (const trio of fittingTrios) {
      const [agent, patient] = await Promise.all([
        agentController.getById(trio.agentId),
        patientController.getById(trio.patientId)
      ]);
      
      // Case-insensitive comparison of the combination
      if (agent?.value.toLowerCase() === subject.toLowerCase() && 
          patient?.value.toLowerCase() === object.toLowerCase()) {
        return true;
      }
    }
    
    // No valid combination found
    return false;
  }

  async getRandomVerb(): Promise<Verb | null> {
    const verbs = await this.getAllVerbs();
    if (verbs.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * verbs.length);
    const selectedVerb = verbs[randomIndex];
    await this.setCurrentVerb(selectedVerb.id);
    
    console.log(`Selected random verb: ${selectedVerb.value} (id: ${selectedVerb.id})`);
    return selectedVerb;
  }

  async getNextVerb(): Promise<Verb | null> {
    const verbs = await this.getAllVerbs();
    if (verbs.length === 0) return null;
    
    // Cycle through verbs: move to next verb index, wrap around at the end
    const nextVerbId = (this.currentVerbId + 1) % verbs.length;
    await this.setCurrentVerb(nextVerbId);
    
    const nextVerb = await this.getCurrentVerb();
    console.log(`Moved to next verb: ${nextVerb?.value} (id: ${nextVerbId})`);
    return nextVerb;
  }
}

export const databaseService = new DatabaseService();