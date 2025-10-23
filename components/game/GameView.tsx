import { Agent, Patient, Verb } from '@/database/schemas';
import { useCardConnections } from '@/hooks/useCardConnections';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { isDesktop, responsiveFontSize, spacing } from '@/utils/responsive';
import { useEffect, useRef } from 'react';
import { LayoutRectangle, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameCard } from './GameCard';
import { SVGConnectionLine } from './SVGConnectionLine';

interface GameViewProps {
  subjects: Agent[];
  objects: Patient[];
  currentVerb: Verb | null;
  selectedSubject: Agent | null;
  selectedObject: Patient | null;
  onSelect: (word: Agent | Patient) => void;
}

export function GameView({ 
  subjects, 
  objects, 
  currentVerb, 
  selectedSubject, 
  selectedObject, 
  onSelect 
}: GameViewProps) {
  const layout = useResponsiveLayout();
  const containerRef = useRef<View>(null);
  const {
    connections,
    registerCardPosition,
    createConnection,
    clearConnections,
  } = useCardConnections();

  // Handle card layout updates with proper positioning
  const handleCardLayout = (cardId: string | number, layout: LayoutRectangle) => {
    // For proper positioning, we need to measure relative to the game container
    registerCardPosition(cardId, layout);
  };

  // Handle container layout to establish reference point
  const handleContainerLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('Container layout:', { x, y, width, height });
  };

  // Handle card selection with connection creation
  const handleCardSelect = (word: Agent | Patient) => {
    onSelect(word);
  };

  // Create connections when cards are selected
  useEffect(() => {
    console.log('Selection changed:', { selectedSubject, selectedObject, currentVerb });
    clearConnections();
    
    // Create connection from subject to verb when subject is selected
    if (selectedSubject && currentVerb) {
      console.log(`Creating subject → verb connection: subject-${selectedSubject.id} → verb-${currentVerb.id}`);
      createConnection(
        `subject-${selectedSubject.id}`,
        `verb-${currentVerb.id}`
      );
    }
    
    // Create connection from verb to object when object is selected
    if (selectedObject && currentVerb) {
      console.log(`Creating verb → object connection: verb-${currentVerb.id} → object-${selectedObject.id}`);
      createConnection(
        `verb-${currentVerb.id}`,
        `object-${selectedObject.id}`
      );
    }
  }, [selectedSubject, selectedObject, currentVerb, createConnection, clearConnections]);
  
  if (layout.isMobile) {
    // Mobile layout: vertical stacking
    return (
      <View ref={containerRef} style={styles.container} onLayout={handleContainerLayout}>
        {/* Connection lines */}
        {connections.map((connection, index) => {
          console.log(`Rendering connection ${index}:`, connection);
          return (
            <SVGConnectionLine
              key={`${connection.startCardId}-${connection.endCardId}-${index}`}
              fromPosition={connection.startPosition}
              toPosition={connection.endPosition}
              color="#4F46E5"
            />
          );
        })}
        
        <ScrollView style={styles.mobileContainer} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { fontSize: isDesktop() ? 24 : responsiveFontSize(32) }]}>
            Yhdistä kortit
          </Text>
          
          <Text style={[styles.mobileSentence, { fontSize: isDesktop() ? 16 : responsiveFontSize(18) }]}>
            {selectedSubject?.value || '[Kuka]'} {currentVerb?.value.toLowerCase() || '[verb]'} {selectedObject?.value.toLowerCase() || '[mitä]'}
          </Text>

          {/* Verb Card */}
          <View style={styles.mobileVerbSection}>
            <GameCard 
              text={currentVerb?.value ?? ""}
              variant="verb"
              cardId={`verb-${currentVerb?.id || 0}`}
              parentRef={containerRef}
              onLayout={handleCardLayout}
            />
          </View>

          {/* Subject Section */}
          <View style={styles.mobileSection}>
            <Text style={[styles.sectionTitle, { fontSize: isDesktop() ? 18 : responsiveFontSize(20) }]}>
              Kuka?
            </Text>
            <View style={styles.mobileCardGrid}>
              {subjects.map((subject) => (
                <GameCard
                  key={subject.id}
                  text={subject.value}
                  isSelected={selectedSubject?.id === subject.id}
                  onPress={() => handleCardSelect(subject)}
                  cardId={`subject-${subject.id}`}
                  parentRef={containerRef}
                  onLayout={handleCardLayout}
                  style={styles.mobileCard}
                />
              ))}
            </View>
          </View>

          {/* Object Section */}
          <View style={styles.mobileSection}>
            <Text style={[styles.sectionTitle, { fontSize: isDesktop() ? 18 : responsiveFontSize(20) }]}>
              Mitä?
            </Text>
            <View style={styles.mobileCardGrid}>
              {objects.map((object) => (
                <GameCard
                  key={object.id}
                  text={object.value}
                  isSelected={selectedObject?.id === object.id}
                  onPress={() => handleCardSelect(object)}
                  cardId={`object-${object.id}`}
                  parentRef={containerRef}
                  onLayout={handleCardLayout}
                  style={styles.mobileCard}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Tablet/Desktop layout: horizontal columns
  return (
    <View ref={containerRef} style={styles.container}>
      {/* Connection lines */}
      {connections.map((connection, index) => {
        console.log(`Rendering desktop connection ${index}:`, connection);
        return (
          <SVGConnectionLine
            key={`${connection.startCardId}-${connection.endCardId}-${index}`}
            fromPosition={connection.startPosition}
            toPosition={connection.endPosition}
            color="#4F46E5"
          />
        );
      })}
      
      <Text style={[styles.title, { fontSize: layout.isDesktop ? 24 : responsiveFontSize(40) }]}>
        Yhdistä kortit
      </Text>
      <View style={styles.row}>
        <View style={styles.cardColumn}>
          <Text style={[styles.sectionTitle, { fontSize: layout.isDesktop ? 18 : responsiveFontSize(24) }]}>
            Kuka?
          </Text>
          {subjects.map((subject) => (
            <GameCard
              key={subject.id}
              text={subject.value}
              isSelected={selectedSubject?.id === subject.id}
              onPress={() => handleCardSelect(subject)}
              cardId={`subject-${subject.id}`}
              parentRef={containerRef}
              onLayout={handleCardLayout}
            />
          ))}
        </View>

        <View style={styles.centerColumn}>
          <Text style={[styles.sectionTitle, { fontSize: layout.isDesktop ? 14 : responsiveFontSize(20) }]}>
            {selectedSubject?.value || '[Kuka]'} {currentVerb?.value.toLowerCase() || '[verb]'} {selectedObject?.value.toLowerCase() || '[mitä]'}
          </Text>
          <GameCard 
            text={currentVerb?.value ?? ""}
            variant="verb"
            cardId={`verb-${currentVerb?.id || 0}`}
            parentRef={containerRef}
            onLayout={handleCardLayout}
          />
        </View>

        <View style={styles.cardColumn}>
          <Text style={[styles.sectionTitle, { fontSize: layout.isDesktop ? 18 : responsiveFontSize(24) }]}>
            Mitä?
          </Text>
          {objects.map((object) => (
            <GameCard
              key={object.id}
              text={object.value}
              isSelected={selectedObject?.id === object.id}
              onPress={() => handleCardSelect(object)}
              cardId={`object-${object.id}`}
              parentRef={containerRef}
              onLayout={handleCardLayout}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  // Desktop/Tablet styles
  title: { 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center',
    color: '#333',
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 8,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: { 
    fontWeight: '600', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#555',
  },
  cardColumn: { 
    flex: 1, 
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  centerColumn: { 
    flex: 1, 
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  // Mobile styles
  mobileContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  mobileSentence: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    fontWeight: '500',
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  mobileVerbSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mobileSection: {
    marginBottom: spacing.xl,
  },
  mobileCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  mobileCard: {
    marginBottom: spacing.md,
  },
});