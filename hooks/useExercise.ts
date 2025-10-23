import { ExerciseActions, exerciseService, ExerciseState } from '@/services/exerciseService';
import { useEffect, useState } from 'react';

export interface UseExerciseReturn extends ExerciseState, ExerciseActions {
  // Additional computed properties for convenience
  isExerciseComplete: boolean;
  canProceed: boolean;
}

export function useExercise(): UseExerciseReturn {
  const [state, setState] = useState<ExerciseState>(exerciseService.getState());

  // Subscribe to service state changes
  useEffect(() => {
    const unsubscribe = exerciseService.subscribe(() => {
      setState(exerciseService.getState());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-validate when both subject and object are selected
  useEffect(() => {
    if (state.selectedSubject && state.selectedObject && state.currentVerb && !state.feedback) {
      const timer = setTimeout(() => {
        exerciseService.validateSelection();
      }, 800); // Delay before showing feedback

      return () => clearTimeout(timer);
    }
  }, [state.selectedSubject, state.selectedObject, state.currentVerb, state.feedback]);

  // Initialize exercise when hook is first used
  useEffect(() => {
    exerciseService.initialize();
  }, []);

  // Computed properties
  const isExerciseComplete = !!(state.selectedSubject && state.selectedObject && state.feedback);
  const canProceed = isExerciseComplete && (state.feedback?.includes('✅') ?? false);

  return {
    // State
    ...state,
    
    // Actions
    generateNewExercise: exerciseService.generateNewExercise.bind(exerciseService),
    handleSelect: exerciseService.handleSelect,
    handleNext: exerciseService.handleNext,
    handleReset: exerciseService.handleReset,
    handleReplay: exerciseService.handleReplay,
    handleNextSet: exerciseService.handleNextSet,
    setCurrentSetId: exerciseService.setCurrentSetId.bind(exerciseService),
    resetProgress: exerciseService.resetProgress.bind(exerciseService),
    
    // Computed properties
    isExerciseComplete,
    canProceed,
  };
}