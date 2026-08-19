import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function Row({ icon, title, subtitle, href }: { icon: string; title: string; subtitle: string; href: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={({ pressed }) => ({ minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 15, opacity: pressed ? 0.7 : 1 })}>
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={18} tintColor={theme.greenDark} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: theme.text }}>{title}</Text>
          <Text style={{ fontSize: 12, color: theme.muted }}>{subtitle}</Text>
        </View>
        <Icon name="chevron.right" size={13} tintColor="#9B9E99" />
      </Pressable>
    </Link>
  );
}

export default function ProfileScreen() {
  const { recipes, shopping, pantry } = useAppState();
  const favorites = recipes.filter(recipe => recipe.favorite).length;
  const openShopping = shopping.filter(item => !item.done).length;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 34, gap: 18, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="fork.knife" size={21} tintColor="white" />
        </View>
        <Text style={{ fontSize: 25, fontWeight: '900', color: theme.text }}>Cook<Text style={{ color: theme.green }}>Mate</Text></Text>
      </View>

      <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, gap: 14, borderWidth: 1, borderColor: theme.line }}>
        <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="person.fill" size={25} tintColor={theme.greenDark} />
        </View>
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 23, fontWeight: '900' }}>Mein CookMate</Text>
          <Text style={{ color: theme.muted, lineHeight: 19 }}>Rezepte, Wochenplanung und Vorräte lokal auf deinem iPhone verwalten.</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 9 }}>
          {[[recipes.length, 'Rezepte'], [favorites, 'Favoriten'], [openShopping, 'offen'], [pantry.length, 'Vorräte']].map(([value, label]) => (
            <View key={String(label)} style={{ flex: 1, borderRadius: 14, backgroundColor: theme.greenSoft, paddingVertical: 11, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 17, fontWeight: '900', color: theme.greenDark }}>{value}</Text>
              <Text style={{ fontSize: 9, color: theme.muted, textAlign: 'center' }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
        <Row icon="book.closed.fill" title="Meine Rezepte" subtitle="Suchen, Favoriten und Rezeptdetails" href="/(tabs)/recipes" />
        <View style={{ height: 1, backgroundColor: theme.line, marginLeft: 66 }} />
        <Row icon="square.and.arrow.down" title="Rezept importieren" subtitle="Rezept über einen Link hinzufügen" href="/import" />
        <View style={{ height: 1, backgroundColor: theme.line, marginLeft: 66 }} />
        <Row icon="gearshape.fill" title="Einstellungen" subtitle="Daten, App-Info und Zurücksetzen" href="/settings" />
      </View>

      <Text style={{ color: '#9A9D98', fontSize: 11, textAlign: 'center' }}>CookMate · lokal gespeichert · Version 1.0.0</Text>
    </ScrollView>
  );
}
