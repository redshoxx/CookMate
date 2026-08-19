import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const categoryOrder = ['Milchprodukte', 'Obst & Gemüse', 'Fleisch', 'Backwaren', 'Sonstiges'];

function productIcon(name: string) {
  const value = name.toLowerCase();
  if (value.includes('milch')) return '🥛';
  if (value.includes('ei')) return '🥚';
  if (value.includes('tomat')) return '🍅';
  if (value.includes('zwiebel')) return '🧅';
  if (value.includes('parmesan') || value.includes('käse')) return '🧀';
  if (value.includes('spaghetti') || value.includes('nudel')) return '🍝';
  if (value.includes('reis')) return '🍚';
  if (value.includes('brot') || value.includes('bun')) return '🥖';
  if (value.includes('hähn') || value.includes('fleisch')) return '🍗';
  return '📦';
}

function expiryInfo(expiresAt?: string) {
  if (!expiresAt) return null;
  const date = new Date(`${expiresAt}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const days = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  const label = date.toLocaleDateString('de-AT', { day: '2-digit', month: 'short', year: 'numeric' });
  return { days, label };
}

export default function PantryScreen() {
  const { pantry, recipes, addPantryItem } = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const grouped = useMemo(() => categoryOrder
    .map(category => ({ category, items: pantry.filter(item => item.category === category || (category === 'Sonstiges' && !categoryOrder.slice(0, -1).includes(item.category))) }))
    .filter(group => group.items.length), [pantry]);

  const cookable = useMemo(() => {
    const pantryNames = new Set(pantry.filter(item => item.amount > 0).map(item => item.name.toLowerCase()));
    return recipes.filter(recipe => recipe.ingredients.every(ingredient => pantryNames.has(ingredient.name.toLowerCase()))).length;
  }, [pantry, recipes]);

  const add = () => {
    const product = name.trim();
    if (!product) return;
    addPantryItem({ id: `pantry-${Date.now()}`, name: product, amount: 1, unit: 'Stk.', category: 'Sonstiges' });
    setName('');
    setAdding(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 12, paddingTop: 50, paddingBottom: 124, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: theme.text }}>Vorrat</Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>Dein Überblick über deine Vorräte</Text>
          </View>
          <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={19} tintColor="#4E534D" /></View>
        </View>

        {grouped.map(group => (
          <View key={group.category} style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: theme.line, overflow: 'hidden', boxShadow: '0 2px 8px rgba(25,48,24,.05)' }}>
            <View style={{ minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 11 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="shippingbox.fill" size={12} tintColor={theme.greenDark} /></View>
              <Text style={{ flex: 1, fontWeight: '900', fontSize: 13 }}>{group.category}</Text>
              <Text style={{ color: theme.muted, fontSize: 10 }}>{group.items.length} Produkte</Text>
              <Icon name="chevron.down" size={11} tintColor="#777C76" />
            </View>

            {group.items.map((item, index) => {
              const expiry = expiryInfo(item.expiresAt);
              const low = !!item.minimum && item.amount < item.minimum;
              return (
                <View key={item.id}>
                  <View style={{ minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 11, paddingVertical: 7 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#F3F5F1', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 23 }}>{productIcon(item.name)}</Text></View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={{ fontSize: 12.5, fontWeight: '800' }}>{item.name}</Text>
                      <Text style={{ color: low ? theme.warning : theme.greenDark, fontSize: 11, fontWeight: '800' }}>{low ? 'wenig · ' : ''}{item.amount} {item.unit}</Text>
                    </View>
                    {expiry ? (
                      <View style={{ alignItems: 'flex-end', gap: 3 }}>
                        <Text style={{ color: expiry.days <= 3 ? theme.warning : theme.muted, fontSize: 9.5 }}>MHD: {expiry.label}</Text>
                        {expiry.days <= 3 ? <View style={{ borderRadius: 7, backgroundColor: expiry.days < 0 ? theme.danger : theme.warning, paddingHorizontal: 6, paddingVertical: 3 }}><Text style={{ color: 'white', fontSize: 8, fontWeight: '900' }}>{expiry.days < 0 ? 'abgelaufen' : expiry.days === 0 ? 'heute' : `in ${expiry.days} Tagen`}</Text></View> : null}
                      </View>
                    ) : null}
                  </View>
                  {index < group.items.length - 1 ? <View style={{ height: 1, backgroundColor: '#F0F1EF', marginLeft: 58 }} /> : null}
                </View>
              );
            })}
          </View>
        ))}

        {adding ? (
          <View style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: theme.line, padding: 12, gap: 9 }}>
            <Text style={{ fontWeight: '900' }}>Vorrat hinzufügen</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Produktname" placeholderTextColor="#9A9E98" style={{ flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: theme.line, paddingHorizontal: 12 }} />
              <Pressable onPress={add} style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}><Icon name="checkmark" size={17} tintColor="white" /></Pressable>
            </View>
            <Pressable onPress={() => setAdding(false)} style={{ alignSelf: 'center', padding: 4 }}><Text style={{ color: theme.muted, fontSize: 12, fontWeight: '700' }}>Abbrechen</Text></Pressable>
          </View>
        ) : null}

        <Pressable onPress={() => router.push('/(tabs)/recipes')} style={({ pressed }) => ({ minHeight: 58, borderRadius: 16, backgroundColor: '#EAF5E4', borderWidth: 1, borderColor: '#D4E8CC', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, opacity: pressed ? 0.8 : 1 })}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}><Icon name="fork.knife" size={17} tintColor="white" /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#526050' }}>Du kannst mit deinem Vorrat</Text>
            <Text style={{ fontSize: 14, fontWeight: '900', color: theme.greenDark }}>{cookable} Rezepte kochen</Text>
          </View>
          <View style={{ borderRadius: 9, backgroundColor: theme.green, paddingHorizontal: 9, paddingVertical: 7 }}><Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>Rezepte ansehen ›</Text></View>
        </Pressable>
      </ScrollView>

      {!adding ? (
        <Pressable onPress={() => setAdding(true)} style={({ pressed }) => ({ position: 'absolute', right: 18, bottom: 102, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.82 : 1, boxShadow: '0 5px 16px rgba(45,123,47,.25)' })}>
          <Icon name="plus" size={24} tintColor="white" />
        </Pressable>
      ) : null}
    </View>
  );
}
