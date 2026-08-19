import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { useAppState } from '@/state/app-state';

const categoryOrder = ['Milchprodukte', 'Obst & Gemüse', 'Sonstiges'];

function productEmoji(name: string) {
  const value = name.toLowerCase();
  if (value.includes('milch')) return '🥛';
  if (value.includes('ei')) return '🥚';
  if (value.includes('parmesan') || value.includes('käse')) return '🧀';
  if (value.includes('tomat')) return '🍅';
  if (value.includes('zwiebel')) return '🧅';
  if (value.includes('spaghetti') || value.includes('pasta')) return '🍝';
  if (value.includes('reis')) return '🍚';
  if (value.includes('brot')) return '🍞';
  return '📦';
}

function categoryInfo(category: string) {
  if (category === 'Milchprodukte') return { icon: 'waterbottle.fill', label: 'Milchprodukte' };
  if (category === 'Obst & Gemüse') return { icon: 'carrot.fill', label: 'Obst & Gemüse' };
  return { icon: 'cabinet.fill', label: 'Trockenwaren' };
}

function expiryInfo(value?: string) {
  if (!value) return null;
  const expiry = new Date(`${value}T23:59:59`);
  const today = new Date();
  const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
  const formatted = expiry.toLocaleDateString('de-AT', { day: '2-digit', month: 'short', year: 'numeric' });
  if (days < 0) return { formatted, badge: 'Abgelaufen', urgent: true };
  if (days === 0) return { formatted, badge: 'Heute', urgent: true };
  if (days <= 2) return { formatted, badge: `in ${days} Tag${days === 1 ? '' : 'en'}`, urgent: true };
  if (days <= 7) return { formatted, badge: `in ${days} Tagen`, urgent: false };
  return { formatted, badge: '', urgent: false };
}

export default function PantryScreen() {
  const { pantry, recipes, addPantryItem } = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const groups = useMemo(() => {
    return categoryOrder
      .map(category => ({ category, items: pantry.filter(item => category === 'Sonstiges' ? !['Milchprodukte', 'Obst & Gemüse'].includes(item.category) : item.category === category) }))
      .filter(group => group.items.length > 0);
  }, [pantry]);

  const cookable = useMemo(() => {
    const pantryNames = new Set(pantry.map(item => item.name.toLowerCase()));
    return recipes.filter(recipe => {
      if (!recipe.ingredients.length) return false;
      const matches = recipe.ingredients.filter(i => pantryNames.has(i.name.toLowerCase())).length;
      return matches / recipe.ingredients.length >= 0.5;
    }).length;
  }, [pantry, recipes]);

  const add = () => {
    if (!name.trim()) return;
    addPantryItem({ id: `pantry-${Date.now()}`, name: name.trim(), amount: 1, unit: 'Stk.', category: 'Sonstiges' });
    setName('');
    setAdding(false);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 11, paddingTop: 50, paddingBottom: 34, gap: 10, backgroundColor: '#F7F8F6' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text selectable style={{ fontSize: 25, fontWeight: '900', letterSpacing: -0.5 }}>Vorrat</Text>
          <Text selectable style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Dein Überblick über deine Vorräte</Text>
        </View>
        <Pressable style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell.badge" size={20} tintColor="#5A5E59" />
        </Pressable>
      </View>

      {groups.map(group => {
        const info = categoryInfo(group.category);
        return (
          <View key={group.category} style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 5px rgba(0,0,0,0.11)', borderCurve: 'continuous' }}>
            <View style={{ height: 38, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#EEF0EB' }}>
              <View style={{ width: 25, height: 25, borderRadius: 13, backgroundColor: '#EEF7EB', alignItems: 'center', justifyContent: 'center', marginRight: 7 }}>
                <Icon name={info.icon} size={13} tintColor="#55A845" />
              </View>
              <Text selectable style={{ flex: 1, fontSize: 12, fontWeight: '800' }}>{info.label}</Text>
              <Text selectable style={{ fontSize: 9.5, color: '#777' }}>{group.items.length} Produkte</Text>
              <Icon name="chevron.down" size={10} tintColor="#777" style={{ marginLeft: 4 }} />
            </View>

            {group.items.map((item, index) => {
              const expiry = expiryInfo(item.expiresAt);
              const low = !!item.minimum && item.amount < item.minimum;
              return (
                <View
                  key={item.id}
                  style={{
                    minHeight: 54,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    borderBottomWidth: index === group.items.length - 1 ? 0 : 1,
                    borderColor: '#F0F1ED'
                  }}
                >
                  <Text selectable style={{ width: 31, fontSize: 24, textAlign: 'center' }}>{productEmoji(item.name)}</Text>
                  <View style={{ flex: 1, gap: 1 }}>
                    <Text selectable style={{ fontSize: 11.5, fontWeight: '800' }}>{item.name}</Text>
                    <Text selectable style={{ fontSize: 10.5, fontWeight: '700', color: low ? '#E0752E' : '#4A9942' }}>
                      {low ? 'wenig' : `${item.amount} ${item.unit}`}
                    </Text>
                  </View>
                  {expiry ? (
                    <View style={{ alignItems: 'flex-end', gap: 3 }}>
                      <Text selectable style={{ fontSize: 8.5, color: expiry.urgent ? '#DB5E3D' : '#6B6B6B' }}>Mindesthaltbar bis: {expiry.formatted}</Text>
                      {expiry.badge ? (
                        <View style={{ borderRadius: 5, backgroundColor: expiry.urgent ? '#FF7D32' : '#F1B34B', paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text selectable style={{ color: 'white', fontSize: 8, fontWeight: '800' }}>{expiry.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <Text selectable style={{ fontSize: 10, color: '#777' }}>{item.amount} {item.unit}</Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}

      {adding ? (
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 9, flexDirection: 'row', gap: 7, boxShadow: '0 1px 5px rgba(0,0,0,0.10)' }}>
          <TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Produktname" returnKeyType="done" style={{ flex: 1, minHeight: 42, paddingHorizontal: 10, fontSize: 13 }} />
          <Pressable onPress={add} style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: '#55A845', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkmark" size={16} tintColor="white" />
          </Pressable>
        </View>
      ) : null}

      <Pressable
        onPress={() => setAdding(value => !value)}
        style={{ alignSelf: 'flex-end', width: 48, height: 48, borderRadius: 24, backgroundColor: '#2FA34A', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,0.22)' }}
      >
        <Icon name={adding ? 'xmark' : 'plus'} size={21} tintColor="white" />
      </Pressable>

      <View style={{ minHeight: 58, backgroundColor: '#E8F4E6', borderRadius: 13, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#CDE4C8' }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#55A845', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="fork.knife" size={17} tintColor="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text selectable style={{ fontSize: 10, color: '#4D7149' }}>Du kannst mit deinem Vorrat</Text>
          <Text selectable style={{ fontSize: 12, fontWeight: '900', color: '#397E35' }}>{cookable} Rezept{cookable === 1 ? '' : 'e'} kochen</Text>
        </View>
        <Pressable style={{ height: 31, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#439B3C', alignItems: 'center', justifyContent: 'center' }}>
          <Text selectable style={{ color: 'white', fontSize: 9.5, fontWeight: '800' }}>Rezepte ansehen →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
