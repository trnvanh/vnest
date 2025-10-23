/**
 * Main Exercise Screen for VN-EST App
 * 
 * This screen handles the core gameplay where users learn Finnish sentence structure
 * by combining subjects (agents), verbs, and objects (patients) to form correct sentences.
 * 
 * Features:
 * - Interactive card-based sentence building
 * - Real-time feedback on combinations
 * - Responsive design for mobile and desktop
 * - Set progression and completion handling
 * 
 * Game Flow:
 * 1. Display current verb and available subject/object cards (in a selected set)
 * 2. User selects subject and object cards
 * 3. System validates the combination
 * 4. Provide immediate feedback (correct/incorrect)
 * 5. Progress to next combination or next set
 */

import {
  CongratsView,
  ErrorView,
  FeedbackView,
  GameHeader,
  GameView,
  LoadingView
} from '@/components/game';
import { useDatabaseWordData } from '@/hooks/useDatabaseWordData';
import { useExercise } from '@/hooks/useExercise';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getSafeAreaConfig, spacing } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function PlayScreen() {
  const router = useRouter();
  const layout = useResponsiveLayout();
  const safeArea = getSafeAreaConfig();
  
  // Database integration hook - manages language data and validation
  const { 
    wordData, 
    isLoading: isDatabaseLoading, 
    error, 
    refreshData,
    setCurrentSet
  } = useDatabaseWordData();
  
  // Exercise management hook - handles all exercise logic
  const {
    // Exercise state
    currentVerb,
    displaySubjects,
    displayObjects,
    selectedSubject,
    selectedObject,
    feedback,
    showCongrats,
    isLoading: isExerciseLoading,
    currentSetId,
    displayCorrectAnswers,
    
    // Exercise actions
    handleSelect,
    handleNext,
    handleReset,
    handleReplay,
    handleNextSet,
  } = useExercise();

  // Combined loading state
  const isLoading = isDatabaseLoading || isExerciseLoading;

  // Handle navigation to progress screen
  const handleNavigateToProgress = () => {
    router.push('/progress');
  };

  // Handle next set with database service integration
  const handleNextSetWithDatabase = async () => {
    await handleNextSet(() => {
      router.push('/progress');
    });
    
    // Also update the database service
    if (currentSetId <= 6) {
      await setCurrentSet(currentSetId + 1);
      await refreshData();
    }
  };

  // Early return for loading or error states after all hooks are called
  if (isLoading) {
    return (
      <>
        <GameHeader />
        <LoadingView />
      </>
    );
  }

  if (error || !wordData) {
    return (
      <>
        <GameHeader />
        <ErrorView 
          error={error}
          onRetry={refreshData}
          onForceReload={refreshData}
        />
      </>
    );
  }

  return (
    <>
      <GameHeader />
      <View style={[
        styles.container,
        layout.isMobile && styles.mobileContainer,
        {
          paddingTop: safeArea.paddingTop,
          paddingBottom: safeArea.paddingBottom,
        }
      ]}>
        {showCongrats ? (
          <CongratsView
            currentSetId={currentSetId}
            verbCount={wordData?.verbs.length}
            onReplay={handleReplay}
            onNextSet={handleNextSetWithDatabase}
          />
        ) : !feedback ? (
          <GameView
            subjects={displaySubjects}
            objects={displayObjects}
            currentVerb={currentVerb}
            selectedSubject={selectedSubject}
            selectedObject={selectedObject}
            onSelect={handleSelect}
          />
        ) : (
          <FeedbackView
            feedback={feedback}
            totalVerbs={wordData?.verbs.length || 0}
            selectedSubject={selectedSubject}
            selectedObject={selectedObject}
            currentVerb={currentVerb}
            correctAnswers={displayCorrectAnswers}
            onNext={handleNext}
            onReset={handleReset}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: spacing.lg, 
    backgroundColor: '#fff' 
  },
  mobileContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
