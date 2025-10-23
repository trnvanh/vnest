import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

interface GameHeaderProps {
  title?: string;
}

export function GameHeader({ title = '' }: GameHeaderProps) {
  const router = useRouter();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.replace('/')} style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 24 }}>🏠</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}