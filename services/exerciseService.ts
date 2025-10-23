import { Agent, Patient, Verb } from '@/database/schemas';
import { avpService } from './avpService';

export interface ExerciseState {
  // Current exercise data
  currentVerb: Verb | null;
  displaySubjects: Agent[];
  displayObjects: Patient[];
  
  // User selections
  selectedSubject: Agent | null;
  selectedObject: Patient | null;
  
  // Feedback and progress
  feedback: string | null;
  correctAnswers: number;
  displayCorrectAnswers: number;
  
  // UI state
  showCongrats: boolean;
  isLoading: boolean;
  
  // Set management
  currentSetId: number;
}

export interface ExerciseActions {
  // Exercise management
  generateNewExercise: () => Promise<void>;
  
  // User interactions
  handleSelect: (word: Agent | Patient) => void;
  handleNext: () => Promise<void>;
  handleReset: () => Promise<void>;
  handleReplay: () => void;
  handleNextSet: (onNavigateToProgress: () => void) => Promise<void>;
  
  // State management
  setCurrentSetId: (setId: number) => void;
  resetProgress: () => void;
}

class ExerciseService {
  private state: ExerciseState = {
    currentVerb: null,
    displaySubjects: [],
    displayObjects: [],
    selectedSubject: null,
    selectedObject: null,
    feedback: null,
    correctAnswers: 0,
    displayCorrectAnswers: 0,
    showCongrats: false,
    isLoading: false,
    currentSetId: 1,
  };

  private listeners: Set<() => void> = new Set();

  // State management
  getState(): ExerciseState {
    return { ...this.state };
  }

  private setState(updates: Partial<ExerciseState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Exercise generation
  async generateNewExercise(): Promise<void> {
    try {
      this.setState({ isLoading: true });
      
      const wordBundle = await avpService.GetRandomWordsForSet(this.state.currentSetId);
      
      if (wordBundle) {
        this.setState({
          currentVerb: wordBundle.verb,
          displaySubjects: wordBundle.agents,
          displayObjects: wordBundle.patients,
          selectedSubject: null,
          selectedObject: null,
          feedback: null,
          isLoading: false,
        });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error generating new exercise:', error);
      this.setState({ isLoading: false });
    }
  }

  // User interactions
  handleSelect = (word: Agent | Patient) => {
    if (word.type === "Agent") {
      this.setState({ selectedSubject: word as Agent });
    } else if (word.type === "Patient") {
      this.setState({ selectedObject: word as Patient });
    } else {
      console.error('Unknown word type:', word);
    }
  };

  // Validate combination and provide feedback
  async validateSelection(): Promise<void> {
    const { selectedSubject, selectedObject, currentVerb } = this.state;
    
    if (!selectedSubject || !selectedObject || !currentVerb) {
      return;
    }

    try {
      const isCorrect = await avpService.IsCorrectCombination(
        selectedSubject, 
        currentVerb, 
        selectedObject
      );
      
      const feedback = isCorrect ? '✅ Hyvin tehty!' : '❌ Yritä uudelleen';
      this.setState({ feedback });
      
      // If correct, update progress
      if (isCorrect) {
        const newCorrectCount = this.state.correctAnswers + 1;
        this.setState({
          correctAnswers: newCorrectCount,
          displayCorrectAnswers: newCorrectCount,
        });
        
        // Check if user has completed 10 exercises
        if (newCorrectCount >= 10) {
          setTimeout(() => {
            this.setState({
              showCongrats: true,
              correctAnswers: 0,
              displayCorrectAnswers: 0,
            });
          }, 2000); // Show feedback for 2 seconds before congratulations
        }
      }
    } catch (error) {
      console.error('Error validating selection:', error);
    }
  }

  handleNext = async () => {
    // Check if user has completed 10 exercises
    if (this.state.correctAnswers >= 10) {
      this.setState({
        showCongrats: true,
        correctAnswers: 0,
        displayCorrectAnswers: 0,
      });
    } else {
      console.log('Getting new random exercise...');
      await this.generateNewExercise();
    }
  };

  handleReset = async () => {
    // Generate new random exercise for the same set
    await this.generateNewExercise();
  };

  handleReplay = () => {
    this.setState({
      selectedSubject: null,
      selectedObject: null,
      feedback: null,
      showCongrats: false,
      correctAnswers: 0,
      displayCorrectAnswers: 0,
    });
  };

  handleNextSet = async (onNavigateToProgress: () => void) => {
    try {
      const nextSetId = this.state.currentSetId + 1;
      
      if (nextSetId <= 6) {
        this.setState({
          currentSetId: nextSetId,
          selectedSubject: null,
          selectedObject: null,
          feedback: null,
          showCongrats: false,
          correctAnswers: 0,
          displayCorrectAnswers: 0,
        });
        
        // Generate new exercise for the new set
        await this.generateNewExercise();
      } else {
        // No more sets, go back to progress screen
        onNavigateToProgress();
      }
    } catch (error) {
      console.error('Error going to next set:', error);
    }
  };

  // Utility methods
  setCurrentSetId(setId: number) {
    this.setState({ currentSetId: setId });
  }

  resetProgress() {
    this.setState({
      correctAnswers: 0,
      displayCorrectAnswers: 0,
      showCongrats: false,
      feedback: null,
      selectedSubject: null,
      selectedObject: null,
    });
  }

  // Initialize exercise when database data is available
  async initialize() {
    if (this.state.displaySubjects.length === 0) {
      await this.generateNewExercise();
    }
  }
}

// Export singleton instance
export const exerciseService = new ExerciseService();