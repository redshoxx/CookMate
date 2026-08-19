import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function amountLabel(amount: number, unit: string) {
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(1).replace('.', ',');
  return `${value} ${unit}`;
}

export default function ShoppingScreen() {
  const { shopping, toggleShopping, addShoppingItem, removeShoppingItem } = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const done = useMemo(() => shopping.filter(item => item.done).length, [shopping]);
  const progress = shopping.length ? done / shopping.length : 0;

  const add = () => {
    const product = name.trim();
    const parsedAmount = Number(amount.replace(',', '.'));
    if (!product) return;
    addShoppingItem({
      id: `custom-${Date.now()}`,
      name: product,
      amount: Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 1,
      unit: 'Stk.',
      category: 'Sonstiges',
      done: false
    });
    setName('');
    setAmount('1');
    setAdding(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 118, gap: 14 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: theme.text }}>Einkaufsliste</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }}>{done} von {shopping.length} erledigt</Text>
          <View style={{ height: 5, borderRadius: 3, backgroundColor: '#DDE1DB', overflow: 'hidden', marginTop: 3 }}>
            <View style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: theme.green, borderRadius: 3 }} />
          </View>
        </View>

        {shopping.length ? (
          <View style={{ backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: theme.line, overflow: 'hidden' }}>
            {shopping.map((item, index) => (
              <View key={item.id}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.done }}
                  onPress={() => toggleShopping(item.id)}
                  onLongPress={() => removeShoppingItem(item.id)}
                  style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13, opacity: pressed ? 0.72 : 1 })}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: item.done ? theme.green : '#8D938B', backgroundColor: item.done ? theme.greenSoft : 'white', alignItems: 'center', justifyContent: 'center' }}>
                    {item.done ? <Icon name="checkmark" size={12} tintColor={theme.greenDark} /> : null}
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: item.done ? '#7E837D' : theme.text, textDecorationLine: item.done ? 'line-through' : 'none' }}>{item.name}</Text>
                  <Text style={{ color: theme.greenDark, fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{amountLabel(item.amount, item.unit)}</Text>
                </Pressable>
                {index < shopping.length - 1 ? <View style={{ height: 1, backgroundColor: '#F0F1EF', marginLeft: 46 }} /> : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ minHeight: 220, borderRadius: 20, borderWidth: 1, borderColor: theme.line, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 28 }}>
            <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="cart" size={22} tintColor={theme.greenDark} /></View>
            <Text style={{ fontSize: 17, fontWeight: '900' }}>Liste ist leer</Text>
            <Text style={{ color: theme.muted, fontSize: 12, textAlign: 'center' }}>Erstelle einen Wocheneinkauf oder füge ein Produkt hinzu.</Text>
          </View>
        )}

        {adding ? (
          <View style={{ borderRadius: 18, backgroundColor: 'white', borderWidth: 1, borderColor: theme.line, padding: 13, gap: 10 }}>
            <Text style={{ fontWeight: '900' }}>Produkt hinzufügen</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput autoFocus value={name} onChangeText={setName} placeholder="Produkt" placeholderTextColor="#9B9F99" onSubmitEditing={add} style={{ flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: theme.line, paddingHorizontal: 12 }} />
              <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={{ width: 65, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: theme.line, paddingHorizontal: 10, textAlign: 'center' }} />
              <Pressable onPress={add} style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center' }}><Icon name="checkmark" size={17} tintColor="white" /></Pressable>
            </View>
            <Pressable onPress={() => setAdding(false)} style={{ alignSelf: 'center', padding: 5 }}><Text style={{ color: theme.muted, fontWeight: '700', fontSize: 12 }}>Abbrechen</Text></Pressable>
          </View>
        ) : null}

        <Text style={{ color: '#9A9E98', textAlign: 'center', fontSize: 10.5 }}>Tipp: Ein Produkt lange gedrückt halten, um es zu löschen.</Text>
      </ScrollView>

      {!adding ? (
        <Pressable onPress={() => setAdding(true)} style={({ pressed }) => ({ position: 'absolute', right: 18, bottom: 102, width: 58, height: 58, borderRadius: 29, backgroundColor: theme.green, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.82 : 1, boxShadow: '0 5px 16px rgba(45,123,47,.25)' })}>
          <Icon name="plus" size={25} tintColor="white" />
        </Pressable>
      ) : null}
    </View>
  );
}
