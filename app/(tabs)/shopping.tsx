import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function ShoppingScreen() {
  const { shopping, toggleShopping, addShoppingItem, removeShoppingItem } = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const doneCount = useMemo(() => shopping.filter(i => i.done).length, [shopping]);
  const progress = shopping.length ? Math.round((doneCount / shopping.length) * 100) : 0;

  const add = () => {
    if (!name.trim()) return;
    addShoppingItem({ id: `custom-${Date.now()}`, name: name.trim(), amount: 1, unit: 'Stk.', category: 'Sonstiges', done: false });
    setName('');
    setAdding(false);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 52, paddingBottom: 34, backgroundColor: '#FAFAF8', minHeight: '100%' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text selectable style={{ fontSize: 26, fontWeight: '900', letterSpacing: -0.6 }}>Einkaufsliste</Text>
        <Pressable onPress={() => setAdding(true)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus.circle.fill" size={25} tintColor="#55A845" />
        </Pressable>
      </View>

      <Text selectable style={{ marginTop: 4, color: '#686868', fontSize: 12 }}>{doneCount} von {shopping.length} erledigt</Text>

      <View style={{ height: 4, borderRadius: 4, backgroundColor: '#D9D9D5', marginTop: 10, overflow: 'hidden' }}>
        <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#55A845', borderRadius: 4 }} />
      </View>

      <View style={{ marginTop: 12 }}>
        {shopping.map(item => (
          <Pressable
            key={item.id}
            onPress={() => toggleShopping(item.id)}
            onLongPress={() => removeShoppingItem(item.id)}
            style={{
              minHeight: 43,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              borderBottomWidth: 1,
              borderColor: '#ECEDE8'
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1.4,
                borderColor: item.done ? '#4C9C44' : '#A7A9A3',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: item.done ? '#F1F8EF' : 'transparent'
              }}
            >
              {item.done ? <Icon name="checkmark" size={12} tintColor="#428F3C" /> : null}
            </View>

            <Text
              selectable
              style={{
                flex: 1,
                fontSize: 14,
                color: item.done ? '#737873' : '#262826',
                textDecorationLine: item.done ? 'line-through' : 'none'
              }}
            >
              {item.name}
            </Text>

            <Text selectable style={{ fontSize: 13, fontWeight: '700', color: '#438B3D', fontVariant: ['tabular-nums'] }}>
              {Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} {item.unit}
            </Text>
          </Pressable>
        ))}
      </View>

      {adding ? (
        <View style={{ marginTop: 18, backgroundColor: 'white', borderRadius: 14, padding: 10, flexDirection: 'row', gap: 8, boxShadow: '0 1px 5px rgba(0,0,0,0.10)' }}>
          <TextInput
            autoFocus
            value={name}
            onChangeText={setName}
            onSubmitEditing={add}
            placeholder="Produkt hinzufügen"
            returnKeyType="done"
            style={{ flex: 1, minHeight: 44, paddingHorizontal: 10, fontSize: 14 }}
          />
          <Pressable onPress={add} style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#55A845', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkmark" size={17} tintColor="white" />
          </Pressable>
          <Pressable onPress={() => setAdding(false)} style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0F1EE', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="xmark" size={15} tintColor="#555" />
          </Pressable>
        </View>
      ) : null}

      <Text selectable style={{ marginTop: 16, textAlign: 'center', fontSize: 10.5, color: theme.muted }}>
        Antippen zum Abhaken · lange drücken zum Löschen
      </Text>
    </ScrollView>
  );
}
