import { ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';

const rows = [
  ['gearshape', 'Allgemein'], ['square.grid.2x2', 'Kategorien verwalten'], ['ruler', 'Einheiten verwalten'], ['arrow.triangle.2.circlepath', 'Backup & Wiederherstellen'], ['square.and.arrow.up', 'Daten exportieren'], ['paintbrush', 'Design'], ['bell', 'Benachrichtigungen'], ['info.circle', 'Über CookMate']
];
export default function SettingsScreen() {
  return <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20 }}><View style={{ borderTopWidth: 1, borderColor: theme.line }}>{rows.map(([icon, title]) => <View key={title} style={{ height: 58, borderBottomWidth: 1, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}><Icon name={icon} size={18} /><Text style={{ flex: 1, fontWeight: '600' }}>{title}</Text><Icon name="chevron.right" size={13} tintColor="#999" /></View>)}</View></ScrollView>;
}
