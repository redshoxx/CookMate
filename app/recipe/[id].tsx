import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, toggleFavorite, addIngredientsToShopping } = useAppState();
  const recipe = recipes.find(item => item.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);

  if (!recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 30 }}>
        <Icon name="exclamationmark.triangle" size={28} tintColor={theme.warning} />
        <Text style={{ fontSize: 18, fontWeight: '800' }}>Rezept nicht gefunden</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: theme.greenDark, fontWeight: '700' }}>Zurück</Text></Pressable>
      </View>
    );
  }

  const factor = servings / recipe.servings;

  return (
    <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: 34, backgroundColor: theme.bg }}>
      <View style={{ height: 330, backgroundColor: '#E9ECE7' }}>
        <Image source={foodImages[recipe.imageKey] ?? foodImages.carbonara} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={180} />
        <Pressable
          onPress={() => toggleFavorite(recipe.id)}
          style={{ position: 'absolute', right: 18, bottom: 18, width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,.96)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={recipe.favorite ? 'heart.fill' : 'heart'} size={21} tintColor={recipe.favorite ? theme.green : theme.text} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: -14, gap: 14 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 22, padding: 18, gap: 13, borderWidth: 1, borderColor: theme.line }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 28, lineHeight: 32, fontWeight: '900', color: theme.text }}>{recipe.title}</Text>
            <Text style={{ color: theme.muted, lineHeight: 20 }}>{recipe.description}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {[["clock", `${recipe.minutes} Min.`], ['gauge.medium', recipe.difficulty], ['person.2', `${servings} Portionen`]].map(([icon, label]) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, backgroundColor: theme.greenSoft, paddingHorizontal: 9, paddingVertical: 7 }}>
                <Icon name={icon} size={12} tintColor={theme.greenDark} />
                <Text style={{ color: theme.greenDark, fontSize: 11, fontWeight: '700' }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, gap: 14, borderWidth: 1, borderColor: theme.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '900' }}>Zutaten</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 12, backgroundColor: '#F4F6F2', paddingHorizontal: 9, minHeight: 38 }}>
              <Pressable onPress={() => setServings(value => Math.max(1, value - 1))} hitSlop={8}><Text style={{ fontSize: 20, color: theme.greenDark }}>−</Text></Pressable>
              <Text style={{ minWidth: 18, textAlign: 'center', fontWeight: '900' }}>{servings}</Text>
              <Pressable onPress={() => setServings(value => value + 1)} hitSlop={8}><Text style={{ fontSize: 20, color: theme.greenDark }}>＋</Text></Pressable>
            </View>
          </View>

          <View style={{ gap: 2 }}>
            {recipe.ingredients.map(item => (
              <View key={item.id} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#F0F1EF' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: theme.green }} />
                <Text style={{ flex: 1, color: theme.text }}>{item.name}</Text>
                <Text style={{ color: theme.greenDark, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{Math.round(item.amount * factor * 10) / 10} {item.unit}</Text>
              </View>
            ))}
          </View>

          <PrimaryButton title="Zur Einkaufsliste hinzufügen" icon="＋" onPress={() => addIngredientsToShopping(recipe, servings)} />
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, gap: 16, borderWidth: 1, borderColor: theme.line }}>
          <Text style={{ fontSize: 18, fontWeight: '900' }}>Zubereitung</Text>
          {recipe.steps.map((step, index) => (
            <View key={step.id} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 31, height: 31, borderRadius: 16, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '900' }}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 4, paddingTop: 4 }}>
                <Text style={{ lineHeight: 21, color: theme.text }}>{step.text}</Text>
                {step.timerSeconds ? <Text style={{ color: theme.greenDark, fontSize: 11, fontWeight: '700' }}>Timer: {Math.round(step.timerSeconds / 60)} Min.</Text> : null}
              </View>
            </View>
          ))}
          <PrimaryButton title="Kochmodus starten" icon="▶" onPress={() => router.push({ pathname: '/cooking/[id]', params: { id: recipe.id } })} />
        </View>
      </View>
    </ScrollView>
  );
}
