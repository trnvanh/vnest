import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <>
      <View style={styles.progressContainer}>
        <Text style={styles.progress}>
          {label || `Olet suorittanut ${current}/${total} lauseharjoitusta`}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});