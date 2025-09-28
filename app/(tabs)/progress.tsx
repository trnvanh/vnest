import { push } from 'expo-router/build/global-state/routing';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const levels = [
  { id: '1', title: 'Ryhmät 1', completed: true },
  { id: '2', title: 'Ryhmät 2', completed: false },
  { id: '3', title: 'Ryhmät 3', completed: false }, 
  { id: '4', title: 'Ryhmät 4', completed: false },
];

export default function ProgressScreen() {
    // Navigation handler to go to the play screen with the selected level
    const handlePlay = () => {
        return () => {
            push('/play');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tasot valinta</Text>
            <FlatList
                data={levels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View style={[styles.levelItem, item.completed && styles.completed]}>
                    <Text style={styles.levelText}>{item.title}</Text>
                    <Text style={styles.status}>
                    {item.completed ? '✓ Valmistunut' : '⏳ Käynnissä'}
                    </Text>
                </View>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={handlePlay()}>
                <Text style={styles.buttonText}>Aloita pelaaminen</Text>
            </TouchableOpacity>   
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
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelItem: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completed: {
    backgroundColor: '#d0f0c0',
  },
  levelText: {
    fontSize: 18,
  },
  status: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 40,
  },
  buttonText: { color: '#fff', fontSize: 25, textAlign: 'center', marginTop: 10 },
});
