import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple interfaces for the new storage system
export interface VerbCombination {
  subject: string;
  object: string;
}

// Verb-keyed correct combinations for easier lookup
export interface VerbCombinations {
  [verb: string]: VerbCombination[];
}

// Combinations organized by word set
export interface AllCombinations {
  [setId: string]: VerbCombinations;
}

export interface WordSet {
  id: number;
  name: string;
  level: number;
  verbs: string[];
  subjects: string[];
  objects: string[];
}

export interface WordData {
  verbs: string[];
  subjects: string[];
  objects: string[];
  sentences: Record<string, { subject: string; object: string }[]>;
}

class SimpleDataService {
  private WORD_SETS_KEY = '@wordSets';
  private CURRENT_SET_KEY = '@currentSet';
  private COMBINATIONS_KEY = '@combinations';

  async initialize(): Promise<void> {
    try {
      console.log('Initializing simple data service...');
      
      // Check if we have any word sets stored
      const existingSets = await this.getWordSets();
      const existingCombinations = await this.getAllCombinations();
      
      // FOR DEVELOPMENT: Always reload initial data to see code changes
      // Remove this in production or when we want to keep user data
      const FORCE_RELOAD_FOR_DEV = true;
      
      if (FORCE_RELOAD_FOR_DEV || existingSets.length === 0 || Object.keys(existingCombinations).length === 0) {
        console.log('Loading initial data (dev mode or no existing data)...');
        await this.loadInitialData();
      } else {
        console.log(`Found ${existingSets.length} word sets and combinations for ${Object.keys(existingCombinations).length} sets`);
      }
      
    } catch (error) {
      console.error('Error initializing data service:', error);
      throw error;
    }
  }

  private async loadInitialData(): Promise<void> {
    // Define word sets
    const wordSets: WordSet[] = [
      {
        id: 1,
        name: "Set 1",
        level: 1,
        verbs: ["Syö", "Juo", "Kokkaa"],
        subjects: ["Äiti", "Lapsi", "Kokki"],
        objects: ["omenaa", "maitoa", "pastaa"]
      },
      {
        id: 2,
        name: "Set 2", 
        level: 2,
        verbs: ["Juoksee", "Kävelee", "Tanssii", "Laulaa", "Piirtää"],
        subjects: ["Urheilija", "Lapsi", "Vanha nainen", "Mies", "Tanssija", "Taiteilija"],
        objects: ["maratonia", "koulua", "puistossa", "töihin", "balettia", "laulua", "kuvaa"]
      },
      {
        id: 3,
        name: "Set 3", 
        level: 3,
        verbs: ["Oppii", "Opettaa", "Ajaa"],
        subjects: ["Opiskelija", "Opettaja", "Kuljettaja"],
        objects: ["suomea", "matematiikkaa", "autoa"]
      },
      {
        id: 4,
        name: "Set 4", 
        level: 4,
        verbs: ["Pelaa", "Katso"],
        subjects: ["Lapsi", "Mies"],
        objects: ["jalkapalloa", "televisiota"]
      }
    ];

    // Define combinations
    const allCombinations: AllCombinations = {
      "1": {
        "Syö": [
          { subject: "Äiti", object: "omenaa" },
          { subject: "Lapsi", object: "omenaa" },
        ],
        "Juo": [
          { subject: "Äiti", object: "maitoa" },
          { subject: "Lapsi", object: "maitoa" },
          { subject: "Kokki", object: "maitoa" },
        ],
        "Kokkaa": [
          { subject: "Äiti", object: "pastaa" },
          { subject: "Kokki", object: "pastaa" }
        ],
        "Kirjoittaa": [
          { subject: "Opettaja", object: "kirjeen" },
          { subject: "Opiskelija", object: "kirjeen" }
        ],
        "Lukee": [
          { subject: "Opettaja", object: "kirjaa" },
          { subject: "Lapsi", object: "kirjaa" }
        ]
      },
      "2": {
        "Juoksee": [
          { subject: "Urheilija", object: "maratonia" },
          { subject: "Lapsi", object: "koulua" }
        ],
        "Kävelee": [
          { subject: "Vanha nainen", object: "puistossa" },
          { subject: "Mies", object: "töihin" }
        ],
        "Tanssii": [
          { subject: "Tanssija", object: "balettia" }
        ],
        "Laulaa": [
          { subject: "Lapsi", object: "laulua" }
        ],
        "Piirtää": [
          { subject: "Taiteilija", object: "kuvaa" }
        ]
      },
      "3": {
        "Oppii": [
          { subject: "Opiskelija", object: "suomea" },
          { subject: "Opiskelija", object: "matematiikkaa" }
        ],
        "Opettaa": [
          { subject: "Opettaja", object: "suomea" },
          { subject: "Opettaja", object: "matematiikkaa" }
        ],
        "Ajaa": [
          { subject: "Kuljettaja", object: "autoa" }
        ]
      },
      "4": {
        "Pelaa": [
          { subject: "Lapsi", object: "jalkapalloa" }
        ],
        "Katso": [
          { subject: "Lapsi", object: "televisiota" },
          { subject: "Mies", object: "televisiota" }
        ]
      }
    };

    // Store word sets and combinations separately
    await Promise.all([
      AsyncStorage.setItem(this.WORD_SETS_KEY, JSON.stringify(wordSets)),
      AsyncStorage.setItem(this.COMBINATIONS_KEY, JSON.stringify(allCombinations))
    ]);
    
    // Only set current set to 1 if no current set exists (preserve user's selection)
    const existingCurrentSet = await AsyncStorage.getItem(this.CURRENT_SET_KEY);
    if (!existingCurrentSet) {
      await AsyncStorage.setItem(this.CURRENT_SET_KEY, '1');
      console.log('Set initial current set to 1');
    } else {
      console.log(`Preserved existing current set: ${existingCurrentSet}`);
    }
    
    console.log(`Loaded ${wordSets.length} word sets and combinations into AsyncStorage`);
  }

  // Get all word sets
  async getWordSets(): Promise<WordSet[]> {
    try {
      const data = await AsyncStorage.getItem(this.WORD_SETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting word sets:', error);
      return [];
    }
  }

  // Get all combinations
  async getAllCombinations(): Promise<AllCombinations> {
    try {
      const data = await AsyncStorage.getItem(this.COMBINATIONS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting combinations:', error);
      return {};
    }
  }

  // Get current active set
  async getCurrentSetId(): Promise<number> {
    try {
      const setId = await AsyncStorage.getItem(this.CURRENT_SET_KEY);
      const currentSetId = setId ? parseInt(setId) : 1;
      console.log('Retrieved current set ID:', currentSetId);
      return currentSetId;
    } catch (error) {
      console.error('Error getting current set:', error);
      return 1;
    }
  }

  // Set current active set
  async setCurrentSet(setId: number): Promise<void> {
    try {
      console.log('Setting current set to:', setId);
      await AsyncStorage.setItem(this.CURRENT_SET_KEY, setId.toString());
      console.log('Successfully set current set to:', setId);
    } catch (error) {
      console.error('Error setting current set:', error);
    }
  }

    // Get word data for the play screen (like the original format)
  async getWordData(): Promise<WordData> {
    try {
      const [wordSets, allCombinations, currentSetId] = await Promise.all([
        this.getWordSets(),
        this.getAllCombinations(),
        this.getCurrentSetId()
      ]);

      console.log('Loading word data for set:', currentSetId);
      console.log('Available word sets:', wordSets.map(s => ({ id: s.id, name: s.name })));

      const currentSet = wordSets.find(set => set.id === currentSetId) || wordSets[0];
      
      if (!currentSet) {
        throw new Error('No word sets available');
      }

      console.log('Selected set:', { id: currentSet.id, name: currentSet.name, verbs: currentSet.verbs });

      const currentCombinations = allCombinations[currentSetId.toString()] || {};

      // Format data like the original structure
      const sentences: Record<string, { subject: string; object: string }[]> = {};
      
      currentSet.verbs.forEach(verb => {
        sentences[verb] = currentCombinations[verb] || [];
      });

      return {
        verbs: currentSet.verbs,
        subjects: currentSet.subjects,
        objects: currentSet.objects,
        sentences
      };
      
    } catch (error) {
      console.error('Error getting word data:', error);
      throw error;
    }
  }

  // Check if a combination is correct
  async isCorrectCombination(subject: string, verb: string, object: string): Promise<boolean> {
    try {
      console.log(`Checking combination: ${subject} ${verb} ${object}`);
      
      const [allCombinations, currentSetId] = await Promise.all([
        this.getAllCombinations(),
        this.getCurrentSetId()
      ]);

      const currentCombinations = allCombinations[currentSetId.toString()];
      if (!currentCombinations) {
        console.log('No combinations found for current set');
        return false;
      }

      console.log(`Current set: ${currentSetId}, Available verbs:`, Object.keys(currentCombinations));
      
      const verbCombinations = currentCombinations[verb];
      if (!verbCombinations) {
        console.log(`No combinations found for verb: ${verb}`);
        return false;
      }

      console.log(`Available combinations for ${verb}:`, verbCombinations);
      
      const isMatch = verbCombinations.some((combo: VerbCombination) => 
        combo.subject === subject && combo.object === object
      );
      
      console.log(`Match result: ${isMatch}`);
      return isMatch;
      
    } catch (error) {
      console.error('Error checking combination:', error);
      return false;
    }
  }

  // Add a new word set
  async addWordSet(wordSet: Omit<WordSet, 'id'>, combinations?: VerbCombinations): Promise<number> {
    try {
      const [wordSets, allCombinations] = await Promise.all([
        this.getWordSets(),
        this.getAllCombinations()
      ]);
      
      const newId = Math.max(...wordSets.map(s => s.id), 0) + 1;
      const newWordSet = { ...wordSet, id: newId };
      
      wordSets.push(newWordSet);
      
      // Add combinations if provided
      if (combinations) {
        allCombinations[newId.toString()] = combinations;
      }
      
      await Promise.all([
        AsyncStorage.setItem(this.WORD_SETS_KEY, JSON.stringify(wordSets)),
        AsyncStorage.setItem(this.COMBINATIONS_KEY, JSON.stringify(allCombinations))
      ]);
      
      return newId;
    } catch (error) {
      console.error('Error adding word set:', error);
      throw error;
    }
  }

  // Add or update combinations for a specific set
  async setCombinationsForSet(setId: number, combinations: VerbCombinations): Promise<void> {
    try {
      const allCombinations = await this.getAllCombinations();
      allCombinations[setId.toString()] = combinations;
      await AsyncStorage.setItem(this.COMBINATIONS_KEY, JSON.stringify(allCombinations));
    } catch (error) {
      console.error('Error setting combinations:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.WORD_SETS_KEY),
        AsyncStorage.removeItem(this.COMBINATIONS_KEY),
        AsyncStorage.removeItem(this.CURRENT_SET_KEY)
      ]);
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Get all AsyncStorage contents
  async debugGetAllStorageData(): Promise<{[key: string]: any}> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: {[key: string]: any} = {};
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        try {
          data[key] = value ? JSON.parse(value) : value;
        } catch {
          data[key] = value;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error getting debug data:', error);
      return {};
    }
  }
}

export const dataService = new SimpleDataService();