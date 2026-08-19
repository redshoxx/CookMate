import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

const categoryOrder = ['Obst & Gemüse', 'Milchprodukte', 'Fleisch', 'Backwaren', 'Sonstiges'];

export default function ShoppingScreen() {
  const { shopping, toggleShopping, addShoppingItem, removeShoppingItem } = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const grouped = useMemo(() => categoryOrder.map(category => ({ category, items: shopping.filter(i => i.category === category) })).filter(g => g.items.length), [shopping]);

  const add = () => {
    if (!name.trim()) return;
    addShoppingItem({ id: `custom-${Date.now()}`, name: name.trim(), amount: 1, unit: 'Stk.', category: 'Sonstiges', done: false });
    setName(''); setAdding(false);
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 30, gap: 18 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ fontSize: 28, fontWeight: '800' }}>Einkaufsliste</Text><Icon name="arrow.clockwise" size={18} /></View>
      {grouped.map(group => (
        <View key={group.category} style={{ gap: 4 }}>
          <Text style={{ color: theme.greenDark, fontWeight: '800', fontSize: 14, paddingVertical: 5 }}>{group.category}</Text>
          {group.items.map(item => (
            <Pressable key={item.id} onPress={() => toggleShopping(item.id)} onLongPress={() => removeShoppingItem(item.id)} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.line, gap: 12 }}>
              <View style={{ width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: item.done ? theme.green : '#76A987', backgroundColor: item.done ? theme.green : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {item.done ? <Icon name="checkmark" size={12} tintColor="white" /> : null}
              </View>
              <Text style={{ flex: 1, fontSize: 14, textDecorationLine: item.done ? 'line-through' : 'none', color: item.done ? '#999' : theme.text }}>{item.name}</Text>
              <Text style={{ fontSize: 13, color: item.done ? '#AAA' : theme.text, fontVariant: ['tabular-nums'] }}>{Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} {item.unit}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      {adding ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Produktname" style={{ flex: 1, borderWidth: 1, borderColor: theme.line, borderRadius: 12, paddingHorizontal: 13, minHeight: 48 }} />
          <Pressable onPress={add} style={{ width: 48, borderRadius: 12, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}><Icon name="checkmark" tintColor="white" /></Pressable>
        </View>
      ) : <PrimaryButton title="Produkt hinzufügen" icon="＋" onPress={() => setAdding(true)} />}
      <Text style={{ fontSize: 11, color: theme.muted, textAlign: 'center' }}>Tipp: Produkt lange gedrückt halten, um es zu löschen.</Text>
    </ScrollView>
  );
}
