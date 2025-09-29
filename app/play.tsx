import {
  CongratsView,
  ErrorView,
  FeedbackView,
  GameHeader,
  GameView,
  LoadingView
} from '@/components/game';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useWordData } from '@/hooks/useWordData';
import { getSafeAreaConfig, spacing } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function PlayScreen() {
  const router = useRouter();
  const layout = useResponsiveLayout();
  const safeArea = getSafeAreaConfig();
  const { 
    wordData, 
    isLoading, 
    error, 
    refreshData,
    isCorrectCombination,
    initializeManually
  } = useWordData();
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [currentSetId, setCurrentSetId] = useState<number>(1);

  // Initialize data on component mount
  useEffect(() => {
    console.log('Play screen mounted, initializing data...');
    
    const initializeData = async () => {
      try {
        await initializeManually();
        console.log('Play screen data initialization complete');
      } catch (error) {
        console.error('Error initializing play screen data:', error);
      }
    };
    
    initializeData();
  }, [initializeManually]);  // All hooks must be called before any conditional logic
  useEffect(() => {
    if (wordData && selectedSubject && selectedObject) {
      const timer = setTimeout(async () => {
        const currentVerb = wordData.verbs[currentVerbIndex];
        const isCorrect = await isCorrectCombination(selectedSubject, currentVerb, selectedObject);
        setFeedback(isCorrect ? '✅ Hyvin tehty!' : '❌ Yritä uudelleen');
      }, 800); // Time delay before showing feedback

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or dependencies change
    }
  }, [selectedSubject, selectedObject, wordData, currentVerbIndex, isCorrectCombination]);

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
      const { dataService } = await import('@/services/simpleDataService');
      const wordSets = await dataService.getWordSets();
      const nextSetId = currentSetId + 1;
      
      // Check if next set exists
      const nextSetExists = wordSets.some(set => set.id === nextSetId);
      if (nextSetExists) {
        await dataService.setCurrentSet(nextSetId);
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
          onForceReload={initializeManually}
        />
      </>
    );
  }

  const { verbs, subjects, objects } = wordData;
  const currentVerb = verbs[currentVerbIndex];

  // Additional safety check
  if (!currentVerb || !verbs.length || !subjects.length || !objects.length) {
    return (
      <>
        <GameHeader />
        <ErrorView 
          error="No word data available"
          onRetry={refreshData}
          onForceReload={initializeManually}
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
            subjects={subjects}
            objects={objects}
            currentVerb={currentVerb}
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
            currentVerb={currentVerb}
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
