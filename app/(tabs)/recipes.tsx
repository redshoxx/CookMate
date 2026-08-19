import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/pill';
import { RecipeCard } from '@/components/recipe-card';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';
import { useMemo, useState } from 'react';

const categories = ['Alle', 'Schnell', 'Pasta', 'Fleisch', 'Vegetarisch'];

export default function RecipesScreen() {
  const { recipes, toggleFavorite } = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const filtered = useMemo(() => recipes.filter(r => {
    const q = query.trim().toLowerCase();
    const byText = !q || r.title.toLowerCase().includes(q) || r.ingredients.some(i => i.name.toLowerCase().includes(q));
    const byCategory = category === 'Alle' || (category === 'Schnell' ? r.minutes <= 25 : r.category === category);
    return byText && byCategory;
  }), [recipes, query, category]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 30, gap: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 28, fontWeight: '800' }}>Rezepte</Text>
        <Link href="/import" asChild><Pressable style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={17} /></Pressable></Link>
      </View>
      <View style={{ height: 44, backgroundColor: '#F4F4F5', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 8 }}>
        <Icon name="magnifyingglass" size={15} tintColor={theme.muted} />
        <TextInput placeholder="Rezepte suchen..." value={query} onChangeText={setQuery} style={{ flex: 1, fontSize: 14 }} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {categories.map(c => <Pressable key={c} onPress={() => setCategory(c)}><Pill active={category === c}>{c}</Pill></Pressable>)}
      </ScrollView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {filtered.map(recipe => <View key={recipe.id} style={{ width: '48%' }}><RecipeCard recipe={recipe} onFavorite={() => toggleFavorite(recipe.id)} /></View>)}
      </View>
    </ScrollView>
  );
}
