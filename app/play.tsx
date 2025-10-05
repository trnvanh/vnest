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
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { getSafeAreaConfig, spacing } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function PlayScreen() {
  const router = useRouter();
  const layout = useResponsiveLayout();
  const safeArea = getSafeAreaConfig();
  
  // Database integration hook - manages language data and validation
  const { 
    wordData,                 // Current verb set data (subjects, objects, current verb)
    isLoading,               // Loading state during data fetching
    error,                   // Error state for data operations
    refreshData,             // Function to refresh current data set
    isCorrectCombination,    // Function to validate Finnish sentence combinations
    nextVerb,                // Function to move to next verb in sequence
    setCurrentSet            // Function to change learning set (verb focus)
  } = useDatabaseWordData();
  
  // Game state management
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);              // Index for current verb exercise
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);  // Currently selected subject card
  const [selectedObject, setSelectedObject] = useState<string | null>(null);    // Currently selected object card
  const [feedback, setFeedback] = useState<string | null>(null);                // Feedback message (correct/incorrect)
  const [showCongrats, setShowCongrats] = useState(false);                     // Show completion screen
  const [currentSetId, setCurrentSetId] = useState<number>(1);                 // Current learning set

  // Initialize with current set on mount
  useEffect(() => {
    setCurrentSet(currentSetId);
  }, [setCurrentSet, currentSetId]);

  // Data will be initialized automatically by the hook
  useEffect(() => {
    if (wordData && selectedSubject && selectedObject && wordData.currentVerb) {
      const timer = setTimeout(async () => {
        // Use the current verb from the word data (the one the exercise is focused on)
        const isCorrect = await isCorrectCombination(selectedSubject, wordData.currentVerb!.value, selectedObject);
        setFeedback(isCorrect ? '✅ Hyvin tehty!' : '❌ Yritä uudelleen');
        
        // If correct, automatically move to next verb after a short delay
        if (isCorrect) {
          setTimeout(async () => {
            await handleCorrectAnswer();
          }, 1500); // Show success message for 1.5 seconds, then move to next verb
        }
      }, 800); // Time delay before showing feedback

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or dependencies change
    }
  }, [selectedSubject, selectedObject, wordData, isCorrectCombination]);

  const handleCorrectAnswer = async () => {
    try {
      // Move to next verb and refresh data
      await nextVerb();
      // Reset selections for the new verb
      setSelectedSubject(null);
      setSelectedObject(null);
      setFeedback(null);
    } catch (error) {
      console.error('Error moving to next verb:', error);
    }
  };

  const handleSelect = (type: 'subject' | 'object', value: string) => {
    if (type === 'subject') setSelectedSubject(value);
    if (type === 'object') setSelectedObject(value);
  };

  const handleNext = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
    setFeedback(null);
    if (wordData) {
      const nextIndex = currentVerbIndex + 1;
      if (nextIndex >= wordData.verbs.length) {
        // Set completed! Show congrats view for navigation to next set
        setShowCongrats(true);
      } else {
        setCurrentVerbIndex(nextIndex);
      }
    }
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
    setFeedback(null);
  };

  const handleReplay = () => {
    setCurrentVerbIndex(0);
    setSelectedSubject(null);
    setSelectedObject(null);
    setFeedback(null);
    setShowCongrats(false);
  };

  const handleNextSet = async () => {
    try {
      const nextSetId = currentSetId + 1;
      
      // We have 6 sets (mapped to verb data in database service)
      if (nextSetId <= 6) {
        await setCurrentSet(nextSetId);
        setCurrentSetId(nextSetId);
        setCurrentVerbIndex(0);
        setSelectedSubject(null);
        setSelectedObject(null);
        setFeedback(null);
        setShowCongrats(false);
        // Refresh data to load new set
        await refreshData();
      } else {
        // No more sets, go back to progress screen
        router.push('/progress');
      }
    } catch (error) {
      console.error('Error going to next set:', error);
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

  const { verbs, subjects, objects, currentVerb } = wordData;
  
  // Map objects to strings for component compatibility
  const subjectStrings = subjects.map(s => s.value);
  const objectStrings = objects.map(o => o.value);

  // Additional safety check
  if (!currentVerb || !verbs.length || !subjects.length || !objects.length) {
    return (
      <>
        <GameHeader />
        <ErrorView 
          error="No word data available"
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
            onNextSet={handleNextSet}
          />
        ) : !feedback ? (
          <GameView
            subjects={subjectStrings}
            objects={objectStrings}
            currentVerb={currentVerb?.value || ''}
            selectedSubject={selectedSubject}
            selectedObject={selectedObject}
            onSelect={handleSelect}
          />
        ) : (
          <FeedbackView
            feedback={feedback}
            currentVerbIndex={currentVerbIndex}
            totalVerbs={verbs.length}
            selectedSubject={selectedSubject}
            selectedObject={selectedObject}
            currentVerb={currentVerb.value}
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
