import { getCardDimensions, getVerbCardDimensions } from '@/utils/responsive';
import { useRef } from 'react';
import { LayoutRectangle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameCardProps {
  text: string;
  isSelected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'verb';
  style?: object;
  cardId?: string | number;
  parentRef?: React.RefObject<View | null>;
  onLayout?: (cardId: string | number, layout: LayoutRectangle) => void;
}

export function GameCard({ 
  text, 
  isSelected = false, 
  onPress, 
  variant = 'default',
  style,
  cardId,
  parentRef,
  onLayout
}: GameCardProps) {
  const isVerb = variant === 'verb';
  const cardDimensions = isVerb ? getVerbCardDimensions() : getCardDimensions();
  const cardRef = useRef<any>(null);
  
  // Get margin values separately for verb cards
  const verbMarginVertical = isVerb && 'marginVertical' in cardDimensions 
    ? cardDimensions.marginVertical 
    : 6;

  const handleLayout = (event: any) => {
    if (cardId && onLayout && parentRef?.current) {
      // Use measureLayout to get position relative to parent container
      setTimeout(() => {
        cardRef.current?.measureLayout(
          parentRef.current,
          (x: number, y: number, width: number, height: number) => {
            console.log(`Card ${cardId} relative position: x=${x}, y=${y}, w=${width}, h=${height}`);
            onLayout(cardId, { x, y, width, height });
          },
          (error: any) => console.error('measureLayout error:', error)
        );
      }, 50); // Small delay to ensure layout is complete
    }
  };
  
  return (
    <TouchableOpacity
      ref={cardRef}
      style={[
        styles.baseCard,
        {
          width: cardDimensions.width,
          height: cardDimensions.height,
          marginVertical: isVerb ? verbMarginVertical : 6,
        },
        isVerb ? styles.verbCard : styles.card,
        isSelected && styles.selectedCard,
        style
      ]}
      onPress={onPress}
      onLayout={handleLayout}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          isVerb ? styles.verbText : styles.cardText,
          { fontSize: cardDimensions.fontSize }
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  selectedCard: { 
    backgroundColor: '#34C759',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  cardText: { 
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  verbCard: {
    backgroundColor: '#007AFF',
    padding: 20,
  },
  verbText: { 
    color: '#fff', 
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});