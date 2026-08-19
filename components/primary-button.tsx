import { Pressable, Text, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/lib/theme';

export function PrimaryButton({ title, onPress, icon, style }: { title: string; onPress: () => void; icon?: string; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress(); }}
      style={({ pressed }) => [{ minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 16, backgroundColor: theme.green, opacity: pressed ? 0.82 : 1 }, style]}
    >
      {icon ? <Text style={{ color: 'white', fontSize: 17 }}>{icon}</Text> : null}
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{title}</Text>
    </Pressable>
  );
}
