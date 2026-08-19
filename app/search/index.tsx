import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/pill';
import { RecipeCard } from '@/components/recipe-card';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function SearchScreen() {
  const { recipes, toggleFavorite } = useAppState();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('Alle');

  const results = useMemo(() => recipes.filter(recipe => {
    const q = query.trim().toLowerCase();
    const textMatch = !q || recipe.title.toLowerCase().includes(q) || recipe.ingredients.some(item => item.name.toLowerCase().includes(q));
    return textMatch && (difficulty === 'Alle' || recipe.difficulty === difficulty);
  }), [query, difficulty, recipes]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 34, gap: 16, backgroundColor: theme.bg }}>
      <View style={{ minHeight: 50, backgroundColor: 'white', borderRadius: 15, borderWidth: 1, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 }}>
        <Icon name="magnifyingglass" size={16} tintColor={theme.muted} />
        <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Curry, Parmesan, Pasta ..." placeholderTextColor="#999D97" returnKeyType="search" style={{ flex: 1, fontSize: 14, color: theme.text }} />
        {query ? <Pressable onPress={() => setQuery('')} hitSlop={8}><Icon name="xmark.circle.fill" size={18} tintColor="#B8BBB6" /></Pressable> : null}
      </View>

      <View style={{ gap: 9 }}>
        <Text style={{ fontWeight: '900', fontSize: 15 }}>Schwierigkeit</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {['Alle', 'Einfach', 'Mittel', 'Schwer'].map(item => <Pressable key={item} onPress={() => setDifficulty(item)}><Pill active={difficulty === item}>{item}</Pill></Pressable>)}
        </View>
      </View>

      <Text style={{ color: theme.muted, fontSize: 12 }}>{results.length} Treffer</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {results.map(recipe => (
          <View key={recipe.id} style={{ width: '48%' }}>
            <RecipeCard recipe={recipe} onFavorite={() => toggleFavorite(recipe.id)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
