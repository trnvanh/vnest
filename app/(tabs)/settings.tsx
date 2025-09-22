import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [fontSize, setFontSize] = useState<number>(20);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Add handler to increase/decrease font size within limits
  const handleFontSize = (change: number) => {
    setFontSize((prev) => Math.max(16, Math.min(32, prev + change)));
  };

  // Add handler to toggle high contrast mode
  const handleContrast = () => setHighContrast((prev) => !prev);

  const handleReset = () => {
    // Add reset logic here (clear AsyncStorage, reset progress, etc.)
    alert('Edistyminen nollattu!');
  };

  return (
    <View style={[styles.container, highContrast && styles.highContrast]}>
      <Text style={[styles.title, { fontSize: fontSize + 20 }]}>Asetukset</Text>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { fontSize }]}>Fonttikoko</Text>
        <View style={styles.fontButtons}>
          <TouchableOpacity style={styles.fontButton} onPress={() => handleFontSize(-2)}>
            <Text style={styles.fontButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.fontSizeValue, { fontSize }]}>{fontSize}</Text>
          <TouchableOpacity style={styles.fontButton} onPress={() => handleFontSize(2)}>
            <Text style={styles.fontButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { fontSize }]}>Korkea kontrasti</Text>
        <Switch value={highContrast} onValueChange={handleContrast} />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={[styles.resetButtonText, { fontSize }]}>Nollaa edistyminen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    highContrast: { backgroundColor: '#0fb1deff'},
    title: { 
        fontWeight: 'bold', 
        marginBottom: 30, 
        textAlign: 'center' 
    },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
    label: { fontSize: 20, color: '#222' },
    fontButtons: { flexDirection: 'row', alignItems: 'center' },
    fontButton: { backgroundColor: '#f2f2f2', padding: 8, borderRadius: 6, marginHorizontal: 8 },
    fontButtonText: { fontSize: 22, color: '#007AFF', fontWeight: 'bold' },
    fontSizeValue: { minWidth: 32, textAlign: 'center', color: '#222' },
    resetButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 40,
    },
    resetButtonText: { color: '#fff', fontWeight: 'bold' },
});

