import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const days = ['MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG', 'SONNTAG'];
const monthNames = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

function weekDates() {
  const now = new Date();
  const monday = new Date(now);
  const weekday = (now.getDay() + 6) % 7;
  monday.setHours(12, 0, 0, 0);
  monday.setDate(now.getDate() - weekday);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function rangeLabel(dates: Date[]) {
  const first = dates[0];
  const last = dates[6];
  if (first.getMonth() === last.getMonth()) return `${first.getDate()}.–${last.getDate()}. ${monthNames[last.getMonth()].replace('.', '')}`;
  return `${first.getDate()}. ${monthNames[first.getMonth()]} – ${last.getDate()}. ${monthNames[last.getMonth()]}`;
}

function recipeTag(category?: string) {
  if (category === 'Vegetarisch') return 'Vegetarisch';
  if (category === 'Pasta') return 'Italienisch';
  if (category === 'Fleisch') return 'Proteinreich';
  return category || 'Einfach';
}

export default function PlanScreen() {
  const { plan, recipes, buildWeeklyShopping, setPlanRecipe } = useAppState();
  const dates = weekDates();

  const chooseNext = (day: number, currentId?: string) => {
    if (!recipes.length) return;
    const currentIndex = Math.max(0, recipes.findIndex(recipe => recipe.id === currentId));
    setPlanRecipe(day, recipes[(currentIndex + 1) % recipes.length].id);
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 50, paddingBottom: 32, gap: 12, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="fork.knife" size={18} tintColor="white" />
        </View>
        <Text selectable style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.7 }}>Cook<Text style={{ color: theme.green }}>Mate</Text></Text>
        <View style={{ marginLeft: 'auto', width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar" size={20} tintColor="#303330" />
        </View>
      </View>

      <View>
        <Text selectable style={{ fontSize: 22, fontWeight: '900', letterSpacing: -0.5 }}>
          Wochenplan <Text style={{ color: theme.green }}>{rangeLabel(dates)}</Text>
        </Text>
        <Text selectable style={{ color: theme.muted, fontSize: 12, marginTop: 3 }}>Dein smarter Plan für die Woche</Text>
      </View>

      <View style={{ gap: 7 }}>
        {plan.map(entry => {
          const recipe = recipes.find(item => item.id === entry.recipeId);
          const date = dates[entry.day];
          return (
            <View key={entry.day} style={{ flexDirection: 'row', alignItems: 'stretch', gap: 8 }}>
              <View style={{ width: 53, paddingTop: 9, alignItems: 'center' }}>
                <Text selectable style={{ color: theme.greenDark, fontSize: 10, fontWeight: '900' }}>{days[entry.day]}</Text>
                <Text selectable style={{ color: '#595D58', fontSize: 10, marginTop: 2 }}>{date.getDate()}. {monthNames[date.getMonth()]}</Text>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.green, marginTop: 8 }} />
              </View>

              {recipe ? (
                <Pressable
                  onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
                  style={({ pressed }) => ({ flex: 1, minHeight: 82, backgroundColor: 'white', borderRadius: 13, padding: 7, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: theme.line, opacity: pressed ? 0.88 : 1, boxShadow: '0 2px 8px rgba(25,48,24,0.06)' })}
                >
                  <Image source={foodImages[recipe.imageKey] ?? foodImages.carbonara} style={{ width: 67, height: 67, borderRadius: 10 }} contentFit="cover" transition={150} />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text selectable numberOfLines={2} style={{ fontSize: 12.5, fontWeight: '800', lineHeight: 16 }}>{recipe.title}</Text>
                    <Text selectable style={{ fontSize: 10.5, color: '#555A54' }}>{recipe.minutes} Min. · {recipe.difficulty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="leaf.fill" size={11} tintColor={theme.green} />
                      <Text selectable style={{ color: theme.greenDark, fontSize: 10.5, fontWeight: '700' }}>{recipeTag(recipe.category)}</Text>
                    </View>
                  </View>
                  <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                      event.stopPropagation();
                      chooseNext(entry.day, recipe.id);
                    }}
                    style={{ width: 34, height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon name="ellipsis" size={17} tintColor="#7B7F79" />
                  </Pressable>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => chooseNext(entry.day)}
                  style={({ pressed }) => ({ flex: 1, minHeight: 82, borderRadius: 13, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.greenSoft, borderWidth: 1, borderColor: '#D7E8D2', opacity: pressed ? 0.82 : 1 })}
                >
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}><Icon name="lightbulb.fill" size={21} tintColor="white" /></View>
                  <View style={{ flex: 1 }}>
                    <Text selectable style={{ fontSize: 12.5, fontWeight: '800' }}>Resteverwertung</Text>
                    <Text selectable style={{ color: '#526150', fontSize: 10.5, lineHeight: 14, marginTop: 2 }}>Tippen, um ein passendes Gericht einzuplanen.</Text>
                  </View>
                  <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#B8D6B2' }}><Icon name="plus" size={17} tintColor={theme.greenDark} /></View>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      <Pressable onPress={buildWeeklyShopping} style={({ pressed }) => ({ height: 48, borderRadius: 13, backgroundColor: theme.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2, opacity: pressed ? 0.82 : 1 })}>
        <Icon name="cart.fill" size={17} tintColor="white" />
        <Text selectable style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Wocheneinkauf erstellen</Text>
      </Pressable>
    </ScrollView>
  );
}
