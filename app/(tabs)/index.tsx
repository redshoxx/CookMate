import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const dayShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function HomeScreen() {
  const { recipes, plan, shopping } = useAppState();
  const todayRecipe = recipes.find(r => r.id === plan[0]?.recipeId) ?? recipes[0];
  const open = shopping.filter(i => !i.done).length;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 30, gap: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ gap: 3 }}>
          <Text style={{ fontSize: 13 }}>Guten Morgen 👋</Text>
          <Text style={{ fontSize: 27, lineHeight: 31, fontWeight: '800' }}>Was möchtest du{`\n`}heute kochen?</Text>
        </View>
        <Link href="/settings" asChild><Pressable style={{ padding: 6 }}><Icon name="bell" size={20} /></Pressable></Link>
      </View>

      <Link href="/search" asChild>
        <Pressable style={{ height: 44, backgroundColor: '#F4F4F5', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13 }}>
          <Icon name="magnifyingglass" size={15} tintColor={theme.muted} />
          <Text style={{ color: '#9A9A9F', fontSize: 14 }}>Rezepte suchen...</Text>
        </Pressable>
      </Link>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '800' }}>Heute</Text>
        <View style={{ minHeight: 210, borderRadius: 16, borderWidth: 1, borderColor: theme.line, overflow: 'hidden', backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', padding: 12, gap: 12 }}>
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ fontWeight: '800', fontSize: 17 }}>{todayRecipe.title}</Text>
              <Text style={{ color: theme.muted, fontSize: 12 }}>ca. {todayRecipe.minutes} Min.</Text>
            </View>
            <Image source={foodImages[todayRecipe.imageKey]} style={{ width: 125, height: 92, borderRadius: 14 }} contentFit="cover" />
          </View>
          <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
            <PrimaryButton title="Kochen starten" onPress={() => router.push({ pathname: '/cooking/[id]', params: { id: todayRecipe.id } })} />
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '800' }}>Diese Woche</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {plan.slice(0, 5).map(entry => {
            const recipe = recipes.find(r => r.id === entry.recipeId);
            return (
              <View key={entry.day} style={{ width: '18%', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontWeight: '700', fontSize: 11 }}>{dayShort[entry.day]}</Text>
                {recipe ? <Image source={foodImages[recipe.imageKey]} style={{ width: 42, height: 42, borderRadius: 21 }} contentFit="cover" /> : <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#F2F2F3', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#AAA' }}>—</Text></View>}
                <Text numberOfLines={1} style={{ fontSize: 9, width: '100%', textAlign: 'center' }}>{recipe?.title.split(' ')[0] ?? ''}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Link href="/(tabs)/shopping" asChild>
        <Pressable style={{ borderRadius: 16, padding: 16, backgroundColor: '#FFF4E8', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={{ fontSize: 15, fontWeight: '800' }}>Einkauf</Text>
            <Text style={{ fontSize: 13 }}>{open} Produkte fehlen</Text>
            <Text style={{ fontSize: 12, color: theme.muted }}>Zur Einkaufsliste</Text>
          </View>
          <Icon name="basket" size={26} tintColor={theme.warning} />
        </Pressable>
      </Link>
    </ScrollView>
  );
}
