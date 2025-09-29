import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VerbSet {
  id?: number;
  name: string;
  level: number;
  verbs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Word {
  id?: number;
  verb: string;
  subject: string;
  object: string;
  setId: number;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncStatus {
  lastSyncAt: string;
  pendingChanges: number;
}

class DatabaseService {
  private WORDS_KEY = '@wordDatabase:words';
  private VERB_SETS_KEY = '@wordDatabase:verbSets';
  private SYNC_STATUS_KEY = '@wordDatabase:syncStatus';
  private nextId = 1;
  private nextSetId = 1;

  async init(): Promise<void> {
    try {
      console.log('AsyncStorage database initialized successfully');
      // Initialize next ID based on existing data
      const words = await this.getWords();
      if (words.length > 0) {
        this.nextId = Math.max(...words.map(w => w.id || 0)) + 1;
      }
      
      // Initialize next Set ID based on existing sets
      const verbSets = await this.getVerbSets();
      if (verbSets.length > 0) {
        this.nextSetId = Math.max(...verbSets.map(s => s.id || 0)) + 1;
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // CRUD Operations for Words
  async addWord(word: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const words = await this.getWords();
    const now = new Date().toISOString();
    const newWord: Word = {
      ...word,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };
    
    words.push(newWord);
    await AsyncStorage.setItem(this.WORDS_KEY, JSON.stringify(words));
    await this.incrementPendingChanges();
    return newWord.id!;
  }

  async getWords(): Promise<Word[]> {
    try {
      const data = await AsyncStorage.getItem(this.WORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting words:', error);
      return [];
    }
  }

  async getWordsByVerb(verb: string): Promise<Word[]> {
    const words = await this.getWords();
    return words.filter(w => w.verb === verb);
  }

  async updateWord(id: number, updates: Partial<Word>): Promise<void> {
    const words = await this.getWords();
    const index = words.findIndex(w => w.id === id);
    
    if (index !== -1) {
      words[index] = { 
        ...words[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await AsyncStorage.setItem(this.WORDS_KEY, JSON.stringify(words));
      await this.incrementPendingChanges();
    }
  }

  async deleteWord(id: number): Promise<void> {
    const words = await this.getWords();
    const filteredWords = words.filter(w => w.id !== id);
    await AsyncStorage.setItem(this.WORDS_KEY, JSON.stringify(filteredWords));
    await this.incrementPendingChanges();
  }

  // Bulk operations for syncing
  async bulkInsertWords(words: Word[]): Promise<void> {
    const existingWords = await this.getWords();
    const newWords = [...existingWords];
    
    for (const word of words) {
      const existingIndex = newWords.findIndex(w => w.id === word.id);
      if (existingIndex !== -1) {
        newWords[existingIndex] = word;
      } else {
        newWords.push(word);
        if (word.id && word.id >= this.nextId) {
          this.nextId = word.id + 1;
        }
      }
    }
    
    await AsyncStorage.setItem(this.WORDS_KEY, JSON.stringify(newWords));
  }

  async getUnsyncedWords(): Promise<Word[]> {
    const words = await this.getWords();
    return words.filter(w => 
      !w.lastSyncedAt || 
      (w.updatedAt && w.lastSyncedAt && w.updatedAt > w.lastSyncedAt)
    );
  }

  async markWordsAsSynced(ids: number[]): Promise<void> {
    const words = await this.getWords();
    const syncTime = new Date().toISOString();
    
    words.forEach(word => {
      if (word.id && ids.includes(word.id)) {
        word.lastSyncedAt = syncTime;
      }
    });
    
    await AsyncStorage.setItem(this.WORDS_KEY, JSON.stringify(words));
  }

  // CRUD Operations for Verb Sets
  async addVerbSet(verbSet: Omit<VerbSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const verbSets = await this.getVerbSets();
    const now = new Date().toISOString();
    const newVerbSet: VerbSet = {
      ...verbSet,
      id: this.nextSetId++,
      createdAt: now,
      updatedAt: now,
    };
    
    verbSets.push(newVerbSet);
    await AsyncStorage.setItem(this.VERB_SETS_KEY, JSON.stringify(verbSets));
    await this.incrementPendingChanges();
    return newVerbSet.id!;
  }

  async getVerbSets(): Promise<VerbSet[]> {
    try {
      const data = await AsyncStorage.getItem(this.VERB_SETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting verb sets:', error);
      return [];
    }
  }

  async getVerbSetById(id: number): Promise<VerbSet | null> {
    const verbSets = await this.getVerbSets();
    return verbSets.find(s => s.id === id) || null;
  }

  async updateVerbSet(id: number, updates: Partial<VerbSet>): Promise<void> {
    const verbSets = await this.getVerbSets();
    const index = verbSets.findIndex(s => s.id === id);
    
    if (index !== -1) {
      verbSets[index] = { 
        ...verbSets[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await AsyncStorage.setItem(this.VERB_SETS_KEY, JSON.stringify(verbSets));
      await this.incrementPendingChanges();
    }
  }

  async deleteVerbSet(id: number): Promise<void> {
    const verbSets = await this.getVerbSets();
    const filteredVerbSets = verbSets.filter(s => s.id !== id);
    await AsyncStorage.setItem(this.VERB_SETS_KEY, JSON.stringify(filteredVerbSets));
    await this.incrementPendingChanges();
  }

  async getWordsBySetId(setId: number): Promise<Word[]> {
    const words = await this.getWords();
    return words.filter(w => w.setId === setId);
  }

  // Sync status operations
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const data = await AsyncStorage.getItem(this.SYNC_STATUS_KEY);
      return data ? JSON.parse(data) : { lastSyncAt: '', pendingChanges: 0 };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return { lastSyncAt: '', pendingChanges: 0 };
    }
  }

  async updateSyncStatus(lastSyncAt: string): Promise<void> {
    const syncStatus = { lastSyncAt, pendingChanges: 0 };
    await AsyncStorage.setItem(this.SYNC_STATUS_KEY, JSON.stringify(syncStatus));
  }

  private async incrementPendingChanges(): Promise<void> {
    const status = await this.getSyncStatus();
    status.pendingChanges += 1;
    await AsyncStorage.setItem(this.SYNC_STATUS_KEY, JSON.stringify(status));
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    await AsyncStorage.removeItem(this.WORDS_KEY);
    await AsyncStorage.removeItem(this.VERB_SETS_KEY);
    await AsyncStorage.removeItem(this.SYNC_STATUS_KEY);
    this.nextId = 1;
    this.nextSetId = 1;
  }

  async close(): Promise<void> {
    // Nothing to close for AsyncStorage
  }
}

export const databaseService = new DatabaseService();