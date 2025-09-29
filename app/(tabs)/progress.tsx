import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Set {
  id: number;
  name: string;
}

export default function ProgressScreen() {
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);

  const sets: Set[] = [
    { id: 1, name: "Setti 1" },
    { id: 2, name: "Setti 2" },
    { id: 3, name: "Setti 3" },
    { id: 4, name: "Setti 4" },
  ];

  const handleSetSelect = async (setId: number) => {
    try {
      console.log('Progress screen: Selecting set', setId);
      // Set the selected set as current in the data service
      const { dataService } = await import('@/services/simpleDataService');
      await dataService.setCurrentSet(setId);
      setSelectedSet(setId);
      console.log('Progress screen: Successfully selected set', setId);
    } catch (error) {
      console.error('Error selecting set:', error);
    }
  };

  const handlePlaySet = () => {
    if (selectedSet) {
      console.log('Progress screen: Navigating to play with set', selectedSet);
      router.push('/play');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valitse setti</Text>
      <Text style={styles.subtitle}>Klikkaa settiä aloittaaksesi</Text>
      
      <View style={styles.setsContainer}>
        {sets.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={[
              styles.setCard,
              selectedSet === set.id && styles.selectedSet
            ]}
            onPress={() => handleSetSelect(set.id)}
          >
            <Text style={[
              styles.setNumber,
              selectedSet === set.id && styles.selectedSetText
            ]}>
              {set.id}
            </Text>
            
            <Text style={[
              styles.setName,
              selectedSet === set.id && styles.selectedSetText
            ]}>
              {set.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSet && (
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handlePlaySet}
        >
          <Text style={styles.playButtonText}>
            Aloita Setti {selectedSet}
          </Text>
        </TouchableOpacity>
      )}
      
      {!selectedSet && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            👆 Valitse setti ylhäältä
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  setsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  setCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedSet: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    transform: [{ scale: 1.02 }],
  },
  setNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 20,
    minWidth: 60,
    textAlign: 'center',
  },
  setName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#555',
  },
  selectedSetText: {
    color: '#2196f3',
  },
  playButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});