import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GameCardProps {
  text: string;
  isSelected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'verb';
  style?: object;
}

export function GameCard({ 
  text, 
  isSelected = false, 
  onPress, 
  variant = 'default',
  style 
}: GameCardProps) {
  const isVerb = variant === 'verb';
  
  return (
    <TouchableOpacity
      style={[
        isVerb ? styles.verbCard : styles.card,
        isSelected && styles.selectedCard,
        style
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={isVerb ? styles.verbText : styles.cardText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  selectedCard: { 
    backgroundColor: '#34C759' 
  },
  cardText: { 
    fontSize: 28 
  },
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
  verbText: { 
    fontSize: 48, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});