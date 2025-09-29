import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameCard } from './GameCard';
import { ProgressBar } from './ProgressBar';

interface FeedbackViewProps {
  feedback: string;
  currentVerbIndex: number;
  totalVerbs: number;
  selectedSubject: string | null;
  selectedObject: string | null;
  currentVerb: string;
  onNext: () => void;
  onReset: () => void;
}

export function FeedbackView({
  feedback,
  currentVerbIndex,
  totalVerbs,
  selectedSubject,
  selectedObject,
  currentVerb,
  onNext,
  onReset
}: FeedbackViewProps) {
  const isCorrect = feedback.includes('✅');

  return (
    <>
      <Text style={styles.title}>{feedback}</Text>
      
      <ProgressBar 
        current={currentVerbIndex + 1}
        total={totalVerbs}
      />

      {/* Chosen cards displayed */}
      <View style={styles.row}>
        <View style={styles.cardColumn}>
          <GameCard text={selectedSubject || ''} />
        </View>

        <View style={styles.cardColumn}>
          <GameCard text={currentVerb} />
        </View>

        <View style={styles.cardColumn}>
          <GameCard text={selectedObject || ''} />
        </View>
      </View>

      {isCorrect ? (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.buttonText}>Jatka</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.buttonText}>Yritä uudelleen</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 8 
  },
  cardColumn: { 
    flex: 1, 
    alignItems: 'center' 
  },
  nextButton: {
    backgroundColor: '#04ba77ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 70,
    marginHorizontal: 40,
  },
  resetButton: {
    backgroundColor: '#c71910ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 70,
    marginHorizontal: 40,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 25, 
    textAlign: 'center', 
    marginTop: 10 
  },
});