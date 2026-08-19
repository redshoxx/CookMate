import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { Pill } from '@/components/pill';
import { PrimaryButton } from '@/components/primary-button';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';
import { useState } from 'react';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, toggleFavorite, addIngredientsToShopping } = useAppState();
  const recipe = recipes.find(r => r.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  if (!recipe) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Rezept nicht gefunden.</Text></View>;
  const factor = servings / recipe.servings;

  return (
    <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: 36, backgroundColor: '#fff' }}>
      <Image source={foodImages[recipe.imageKey]} style={{ width: '100%', height: 310 }} contentFit="cover" />
      <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 18 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}><Text style={{ fontSize: 27, fontWeight: '800' }}>{recipe.title}</Text><Text style={{ color: theme.muted, lineHeight: 20 }}>{recipe.description}</Text></View>
          <Pressable onPress={() => toggleFavorite(recipe.id)} style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: theme.line, alignItems: 'center', justifyContent: 'center' }}><Icon name={recipe.favorite ? 'heart.fill' : 'heart'} tintColor={recipe.favorite ? '#D92D20' : '#111'} /></Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}><Pill>{recipe.minutes} Min.</Pill><Pill>{recipe.difficulty}</Pill><Pill>{servings} Portionen</Pill></View>
        <Text style={{ fontSize: 15, fontWeight: '800' }}>ZUTATEN</Text>
        <View style={{ gap: 11 }}>{recipe.ingredients.map(i => <View key={i.id} style={{ flexDirection: 'row', gap: 9 }}><Text>•</Text><Text style={{ flex: 1 }}>{Math.round(i.amount * factor * 10) / 10} {i.unit} {i.name}</Text></View>)}</View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, borderWidth: 1, borderColor: theme.line, borderRadius: 12, minHeight: 48 }}><Pressable onPress={() => setServings(s => Math.max(1, s - 1))}><Text style={{ fontSize: 22 }}>−</Text></Pressable><Text style={{ fontWeight: '700', minWidth: 90, textAlign: 'center' }}>{servings} Portionen</Text><Pressable onPress={() => setServings(s => s + 1)}><Text style={{ fontSize: 22 }}>＋</Text></Pressable></View>
        <PrimaryButton title="Zutaten zur Einkaufsliste" onPress={() => addIngredientsToShopping(recipe, servings)} />
        <Text style={{ fontSize: 15, fontWeight: '800', marginTop: 6 }}>ZUBEREITUNG</Text>
        <View style={{ gap: 16 }}>{recipe.steps.map((step, idx) => <View key={step.id} style={{ flexDirection: 'row', gap: 12 }}><View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: theme.greenDark, fontWeight: '800' }}>{idx + 1}</Text></View><Text style={{ flex: 1, lineHeight: 21 }}>{step.text}</Text></View>)}</View>
        <PrimaryButton title="▶ Kochmodus starten" onPress={() => router.push({ pathname: '/cooking/[id]', params: { id: recipe.id } })} />
      </View>
    </ScrollView>
  );
}
