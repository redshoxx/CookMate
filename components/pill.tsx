import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <View style={{ paddingHorizontal: 11, paddingVertical: 7, borderRadius: 12, backgroundColor: active ? theme.green : '#F1F1F2' }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: active ? 'white' : theme.muted }}>{children}</Text>
    </View>
  );
}
