import { dataService, WordData } from '@/services/simpleDataService';
import { useCallback, useState } from 'react';

export interface UseWordDataReturn {
  wordData: WordData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  isCorrectCombination: (subject: string, verb: string, object: string) => Promise<boolean>;
  forceReload: () => Promise<void>;
  initializeManually: () => Promise<void>;
}

export function useWordData(): UseWordDataReturn {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  // Initialize the data service and load initial data
  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await dataService.initialize();
      await refreshData();
      
    } catch (err) {
      console.error('Error initializing word data:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data from local storage
  const refreshData = useCallback(async () => {
    try {
      const data = await dataService.getWordData();
      setWordData(data);
      
    } catch (err) {
      console.error('Error refreshing word data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  }, []);

  // Check if a combination is correct
  const isCorrectCombination = useCallback(async (subject: string, verb: string, object: string): Promise<boolean> => {
    try {
      return await dataService.isCorrectCombination(subject, verb, object);
    } catch (err) {
      console.error('Error checking combination:', err);
      return false;
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(async () => {
    try {
      await dataService.clearAllData();
      setWordData(null);
      await initializeData();
    } catch (err) {
      console.error('Error clearing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    }
  }, [initializeData]);

  // Force reload - clear everything and reinitialize
  const forceReload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clear all data first
      await dataService.clearAllData();
      // Then reinitialize
      await dataService.initialize();
      await refreshData();
      
    } catch (err) {
      console.error('Error force reloading:', err);
      setError(err instanceof Error ? err.message : 'Failed to reload data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);

  // Manual initialize method for components to control initialization
  const initializeManually = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await dataService.initialize();
      await refreshData();
      
    } catch (err) {
      console.error('Error initializing word data manually:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize data');
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);


  return {
    wordData,
    isLoading,
    error,
    refreshData,
    clearAllData,
    isCorrectCombination,
    forceReload,
    initializeManually,
  };
}