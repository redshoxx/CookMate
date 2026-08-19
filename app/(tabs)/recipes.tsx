import { useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/pill';
import { RecipeCard } from '@/components/recipe-card';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const categories = ['Alle', 'Schnell', 'Pasta', 'Fleisch', 'Vegetarisch'];

export default function RecipesScreen() {
  const { recipes, toggleFavorite } = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');

  const filtered = useMemo(() => recipes.filter(recipe => {
    const q = query.trim().toLowerCase();
    const matchesText = !q || recipe.title.toLowerCase().includes(q) || recipe.ingredients.some(item => item.name.toLowerCase().includes(q));
    const matchesCategory = category === 'Alle' || (category === 'Schnell' ? recipe.minutes <= 25 : recipe.category === category);
    return matchesText && matchesCategory;
  }), [recipes, query, category]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 34, gap: 16, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 3 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: theme.text }}>Rezepte</Text>
          <Text style={{ color: theme.muted, fontSize: 13 }}>{recipes.length} Rezepte in deiner Sammlung</Text>
        </View>
        <Link href="/import" asChild>
          <Pressable style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 15, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.82 : 1 })}>
            <Icon name="plus" size={19} tintColor="white" />
          </Pressable>
        </Link>
      </View>

      <View style={{ minHeight: 48, backgroundColor: 'white', borderRadius: 15, borderWidth: 1, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 }}>
        <Icon name="magnifyingglass" size={16} tintColor={theme.muted} />
        <TextInput
          placeholder="Rezepte oder Zutaten suchen"
          placeholderTextColor="#9A9D98"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          style={{ flex: 1, fontSize: 14, color: theme.text }}
        />
        {query ? <Pressable onPress={() => setQuery('')} hitSlop={8}><Icon name="xmark.circle.fill" size={17} tintColor="#B4B7B2" /></Pressable> : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {categories.map(item => <Pressable key={item} onPress={() => setCategory(item)}><Pill active={category === item}>{item}</Pill></Pressable>)}
      </ScrollView>

      {filtered.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {filtered.map(recipe => (
            <View key={recipe.id} style={{ width: '48%' }}>
              <RecipeCard recipe={recipe} onFavorite={() => toggleFavorite(recipe.id)} />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ minHeight: 220, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 28 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="magnifyingglass" size={21} tintColor={theme.greenDark} /></View>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>Keine Treffer</Text>
          <Text style={{ color: theme.muted, textAlign: 'center', fontSize: 13 }}>Passe Suche oder Kategorie an.</Text>
        </View>
      )}
    </ScrollView>
  );
}
