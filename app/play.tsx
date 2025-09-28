import { IconSymbol } from '@/components/ui/icon-symbol';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const sentences: Record<string, { subject: string; object: string }[]> = {
  Kokkaa: [
    { subject: 'Äiti', object: 'Pastaa' },
    { subject: 'Kokki', object: 'Pastaa' },
  ],
  Kirjoittaa: [
    { subject: 'Opettaja', object: 'Kirjeen' },
  ],
  Syö: [
    { subject: 'Äiti', object: 'Pastaa' },
    { subject: 'Opettaja', object: 'Pastaa' },
  ],
};

const verbs = Object.keys(sentences);
const subjects = ['Äiti', 'Opettaja', 'Kokki'];
const objects = ['Pastaa', 'Kirjeen', 'Kahvia'];

export default function PlayScreen() {
  const router = useRouter();
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentVerb = verbs[currentVerbIndex];
  const isComplete = selectedSubject && selectedObject;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        const correctPairs = sentences[currentVerb];
        const isCorrect = correctPairs.some(
          (pair) => pair.subject === selectedSubject && pair.object === selectedObject
        );
        setFeedback(isCorrect ? '✅ Hyvin tehty!' : '❌ Yritä uudelleen');
      }, 800); // Time delay before showing feedback

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or dependencies change
    }
  }, [selectedSubject, selectedObject]);

  const handleSelect = (type: 'subject' | 'object', value: string) => {
    if (type === 'subject') setSelectedSubject(value);
    if (type === 'object') setSelectedObject(value);
  };

  const handleNext = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
    setFeedback(null);
    setCurrentVerbIndex((prev) => (prev + 1) % verbs.length);
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
    setFeedback(null);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={{ marginLeft: 10 }}>
              <IconSymbol size={35} name="house.fill" color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {!feedback ? (
          <>
            <Text style={styles.title}>Yhdistä kortit</Text>
            <View style={styles.row}>
              <View style={styles.cardColumn}>
                <Text style={styles.sectionTitle}>Kuka?</Text>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.card,
                      selectedSubject === subject && styles.selectedCard,
                    ]}
                    onPress={() => handleSelect('subject', subject)}
                  >
                    <Text style={styles.cardText}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.centerColumn}>
                <Text style={styles.sectionTitle}>{selectedSubject} {currentVerb.toLowerCase()} {selectedObject?.toLowerCase()}</Text>
                <View style={styles.verbCard}>
                  <Text style={styles.verbText}>{currentVerb}</Text>
                </View>
              </View>

              <View style={styles.cardColumn}>
                <Text style={styles.sectionTitle}>Mitä?</Text>
                {objects.map((object) => (
                  <TouchableOpacity
                    key={object}
                    style={[
                      styles.card,
                      selectedObject === object && styles.selectedCard,
                    ]}
                    onPress={() => handleSelect('object', object)}
                  >
                    <Text style={styles.cardText}>{object}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{feedback}</Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progress}>
                Olet suorittanut {currentVerbIndex + 1}/{verbs.length} lauseharjoitusta
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${((currentVerbIndex + 1) / verbs.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            {/* Chosen cards displayed */}
            <View style={styles.row}>
              <View style={styles.cardColumn}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{selectedSubject}</Text>
                </View>
              </View>

              <View style={styles.cardColumn}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{currentVerb}</Text>
                </View>
              </View>

              <View style={styles.cardColumn}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{selectedObject}</Text>
                </View>
              </View>
            </View>

            {feedback.includes('✅') ? (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Jatka</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.buttonText}>Yritä uudelleen</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 48, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  sectionTitle: { fontSize: 28, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  cardColumn: { flex: 1, alignItems: 'center' },
  centerColumn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    marginVertical: 6,
    borderRadius: 10,
    width: 250,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCard: { backgroundColor: '#34C759' },
  cardText: { fontSize: 28 },
  verbCard: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    marginVertical: 120,
    width: 250,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verbText: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
  progressContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: '#D9D9D9',
    padding: 10,
    borderRadius: 10, 
    width: '70%',
    marginHorizontal: 200,
  },
  progress: {
    fontSize: 30,
    textAlign: 'center',
    color: '#555',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
    alignSelf: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  buttonText: { color: '#fff', fontSize: 25, textAlign: 'center', marginTop: 10 },
});
