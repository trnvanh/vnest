import { StyleSheet, Text, View } from 'react-native';
import { GameCard } from './GameCard';

interface GameViewProps {
  subjects: string[];
  objects: string[];
  currentVerb: string;
  selectedSubject: string | null;
  selectedObject: string | null;
  onSelect: (type: 'subject' | 'object', value: string) => void;
}

export function GameView({ 
  subjects, 
  objects, 
  currentVerb, 
  selectedSubject, 
  selectedObject, 
  onSelect 
}: GameViewProps) {
  return (
    <>
      <Text style={styles.title}>Yhdistä kortit</Text>
      <View style={styles.row}>
        <View style={styles.cardColumn}>
          <Text style={styles.sectionTitle}>Kuka?</Text>
          {subjects.map((subject) => (
            <GameCard
              key={subject}
              text={subject}
              isSelected={selectedSubject === subject}
              onPress={() => onSelect('subject', subject)}
            />
          ))}
        </View>

        <View style={styles.centerColumn}>
          <Text style={styles.sectionTitle}>
            {selectedSubject || '[Kuka]'} {currentVerb?.toLowerCase() || '[verb]'} {selectedObject?.toLowerCase() || '[mitä]'}
          </Text>
          <GameCard 
            text={currentVerb}
            variant="verb"
          />
        </View>

        <View style={styles.cardColumn}>
          <Text style={styles.sectionTitle}>Mitä?</Text>
          {objects.map((object) => (
            <GameCard
              key={object}
              text={object}
              isSelected={selectedObject === object}
              onPress={() => onSelect('object', object)}
            />
          ))}
        </View>
      </View>
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
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: '600', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  cardColumn: { 
    flex: 1, 
    alignItems: 'center' 
  },
  centerColumn: { 
    flex: 1, 
    alignItems: 'center',
  },
});