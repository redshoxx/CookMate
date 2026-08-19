import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function InfoRow({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <View style={{ minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14 }}>
      <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={16} tintColor={theme.greenDark} /></View>
      <Text style={{ flex: 1, fontWeight: '700' }}>{title}</Text>
      <Text selectable style={{ color: theme.muted, fontSize: 12 }}>{value}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { resetState } = useAppState();

  const reset = () => {
    Alert.alert(
      'CookMate zurücksetzen?',
      'Rezepte, Einkaufsliste, Wochenplan und Vorrat werden auf die mitgelieferten Beispieldaten zurückgesetzt.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zurücksetzen', style: 'destructive', onPress: resetState }
      ]
    );
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, paddingBottom: 34, gap: 16, backgroundColor: theme.bg }}>
      <View style={{ backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
        <InfoRow icon="internaldrive.fill" title="Datenspeicherung" value="Lokal auf dem Gerät" />
        <View style={{ height: 1, backgroundColor: theme.line, marginLeft: 60 }} />
        <InfoRow icon="app.badge" title="Bundle-ID" value="at.cookmate.app" />
        <View style={{ height: 1, backgroundColor: theme.line, marginLeft: 60 }} />
        <InfoRow icon="info.circle.fill" title="Version" value="1.0.0" />
      </View>

      <View style={{ backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
        <Link href="/(tabs)/recipes" asChild>
          <Pressable style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, opacity: pressed ? 0.7 : 1 })}>
            <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="book.closed.fill" size={16} tintColor={theme.greenDark} /></View>
            <Text style={{ flex: 1, fontWeight: '700' }}>Rezepte verwalten</Text>
            <Icon name="chevron.right" size={13} tintColor="#A0A39E" />
          </Pressable>
        </Link>
        <View style={{ height: 1, backgroundColor: theme.line, marginLeft: 60 }} />
        <Link href="/import" asChild>
          <Pressable style={({ pressed }) => ({ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, opacity: pressed ? 0.7 : 1 })}>
            <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="square.and.arrow.down" size={16} tintColor={theme.greenDark} /></View>
            <Text style={{ flex: 1, fontWeight: '700' }}>Rezept importieren</Text>
            <Icon name="chevron.right" size={13} tintColor="#A0A39E" />
          </Pressable>
        </Link>
      </View>

      <Pressable onPress={reset} style={({ pressed }) => ({ minHeight: 52, borderRadius: 15, backgroundColor: '#FFF0EF', borderWidth: 1, borderColor: '#FFD4D1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pressed ? 0.75 : 1 })}>
        <Icon name="arrow.counterclockwise" size={16} tintColor={theme.danger} />
        <Text style={{ color: theme.danger, fontWeight: '800' }}>Beispieldaten zurücksetzen</Text>
      </Pressable>

      <Text style={{ color: '#969A94', textAlign: 'center', fontSize: 11, lineHeight: 16 }}>CookMate speichert App-Daten lokal. Beim Löschen der App können diese Daten verloren gehen.</Text>
    </ScrollView>
  );
}
