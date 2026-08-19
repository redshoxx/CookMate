import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Pill } from '@/components/pill';
import { RecipeCard } from '@/components/recipe-card';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function SearchScreen() {
  const { recipes, toggleFavorite } = useAppState();
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState('Alle');
  const results = useMemo(() => recipes.filter(r => (!q || r.title.toLowerCase().includes(q.toLowerCase()) || r.ingredients.some(i => i.name.toLowerCase().includes(q.toLowerCase()))) && (difficulty === 'Alle' || r.difficulty === difficulty)), [q, difficulty, recipes]);
  return <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 17 }}><TextInput autoFocus value={q} onChangeText={setQ} placeholder="z. B. Curry oder Parmesan" style={{ minHeight: 46, borderRadius: 12, backgroundColor: '#F3F3F4', paddingHorizontal: 13 }} /><Text style={{ fontWeight: '800' }}>Schwierigkeit</Text><View style={{ flexDirection: 'row', gap: 8 }}>{['Alle', 'Einfach', 'Mittel', 'Schwer'].map(x => <Pressable key={x} onPress={() => setDifficulty(x)}><Pill active={difficulty === x}>{x}</Pill></Pressable>)}</View><Text style={{ color: theme.muted }}>{results.length} Treffer</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{results.map(r => <View key={r.id} style={{ width: '48%' }}><RecipeCard recipe={r} onFavorite={() => toggleFavorite(r.id)} /></View>)}</View></ScrollView>;
}
