import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/primary-button';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export default function PlanScreen() {
  const { plan, recipes, buildWeeklyShopping, setPlanRecipe } = useAppState();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 30, gap: 18 }}>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Wochenplan</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <Text style={{ fontSize: 18 }}>‹</Text><Text style={{ fontSize: 15, fontWeight: '700' }}>17. – 23. August</Text><Text style={{ fontSize: 18 }}>›</Text>
      </View>
      <View style={{ borderTopWidth: 1, borderColor: theme.line }}>
        {plan.map(entry => {
          const recipe = recipes.find(r => r.id === entry.recipeId);
          return (
            <View key={entry.day} style={{ minHeight: 76, borderBottomWidth: 1, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ color: theme.muted, fontSize: 11 }}>{days[entry.day]}</Text>
                {recipe ? <Text style={{ fontWeight: '700', fontSize: 14 }}>{recipe.title}</Text> : <Pressable onPress={() => setPlanRecipe(entry.day, recipes[(entry.day + 1) % recipes.length].id)}><Text style={{ color: theme.green, fontWeight: '600', fontSize: 13 }}>＋ Gericht hinzufügen</Text></Pressable>}
              </View>
              {recipe ? <Image source={foodImages[recipe.imageKey]} style={{ width: 48, height: 48, borderRadius: 12 }} contentFit="cover" /> : null}
            </View>
          );
        })}
      </View>
      <PrimaryButton title="Wocheneinkauf erstellen" onPress={buildWeeklyShopping} />
      <Text style={{ fontSize: 12, color: theme.muted, textAlign: 'center' }}>Gleiche Zutaten werden in der Einkaufsliste automatisch zusammengefasst.</Text>
    </ScrollView>
  );
}
