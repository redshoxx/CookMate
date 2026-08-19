import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const days = ['MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG', 'SONNTAG'];
const dates = ['17. Aug.', '18. Aug.', '19. Aug.', '20. Aug.', '21. Aug.', '22. Aug.', '23. Aug.'];

function recipeTag(category?: string) {
  if (category === 'Vegetarisch') return 'Vegetarisch';
  if (category === 'Pasta') return 'Italienisch';
  if (category === 'Fleisch') return 'Proteinreich';
  return 'Einfach';
}

export default function PlanScreen() {
  const { plan, recipes, buildWeeklyShopping, setPlanRecipe } = useAppState();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 50, paddingBottom: 32, gap: 12, backgroundColor: '#F7F8F6' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#59A943', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="fork.knife" size={18} tintColor="white" />
        </View>
        <Text selectable style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.7 }}>CookMate</Text>
        <Pressable style={{ marginLeft: 'auto', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar" size={20} tintColor="#303030" />
        </Pressable>
      </View>

      <View>
        <Text selectable style={{ fontSize: 22, fontWeight: '900', letterSpacing: -0.5 }}>
          Wochenplan <Text style={{ color: '#58A844' }}>17.–23. August</Text>
        </Text>
        <Text selectable style={{ color: '#666', fontSize: 12, marginTop: 3 }}>Dein smarter Plan für die Woche</Text>
      </View>

      <View style={{ gap: 7 }}>
        {plan.map(entry => {
          const recipe = recipes.find(r => r.id === entry.recipeId);
          const fallback = recipes[(entry.day + 1) % recipes.length];

          return (
            <View key={entry.day} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8 }}>
              <View style={{ width: 53, paddingTop: 9, alignItems: 'center' }}>
                <Text selectable style={{ color: '#3F8E3A', fontSize: 10, fontWeight: '900' }}>{days[entry.day]}</Text>
                <Text selectable style={{ color: '#595959', fontSize: 10, marginTop: 2 }}>{dates[entry.day]}</Text>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#55A845', marginTop: 8 }} />
              </View>

              {recipe ? (
                <Pressable
                  onPress={() => setPlanRecipe(entry.day, recipes[(recipes.findIndex(r => r.id === recipe.id) + 1) % recipes.length].id)}
                  style={{
                    flex: 1,
                    minHeight: 82,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 7,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 9,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                    borderCurve: 'continuous'
                  }}
                >
                  <Image source={foodImages[recipe.imageKey]} style={{ width: 67, height: 67, borderRadius: 10 }} contentFit="cover" />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text selectable numberOfLines={2} style={{ fontSize: 12.5, fontWeight: '800', lineHeight: 16 }}>{recipe.title}</Text>
                    <Text selectable style={{ fontSize: 10.5, color: '#555' }}>{recipe.minutes} Min. · {recipe.difficulty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="leaf.fill" size={11} tintColor="#58A844" />
                      <Text selectable style={{ color: '#4D9A42', fontSize: 10.5, fontWeight: '600' }}>{recipeTag(recipe.category)}</Text>
                    </View>
                  </View>
                  <Icon name="ellipsis" size={17} tintColor="#7B7B7B" />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => setPlanRecipe(entry.day, fallback.id)}
                  style={{
                    flex: 1,
                    minHeight: 82,
                    borderRadius: 12,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#EEF6EC',
                    borderWidth: 1,
                    borderColor: '#D7E9D3',
                    borderCurve: 'continuous'
                  }}
                >
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#5BAA49', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="lightbulb.fill" size={21} tintColor="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text selectable style={{ fontSize: 12.5, fontWeight: '800' }}>Resteverwertung:</Text>
                    <Text selectable style={{ color: '#4E5F4C', fontSize: 10.5, lineHeight: 14, marginTop: 2 }}>Nutze deinen Vorrat oder füge ein Gericht hinzu.</Text>
                  </View>
                  <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#B8D6B2' }}>
                    <Icon name="plus" size={17} tintColor="#4D9A42" />
                  </View>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={buildWeeklyShopping}
        style={{ height: 48, borderRadius: 13, backgroundColor: '#58A844', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2 }}
      >
        <Icon name="cart.fill" size={17} tintColor="white" />
        <Text selectable style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Wocheneinkauf erstellen</Text>
      </Pressable>
    </ScrollView>
  );
}
