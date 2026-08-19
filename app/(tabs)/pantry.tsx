import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Pill } from '@/components/pill';
import { PrimaryButton } from '@/components/primary-button';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function PantryScreen() {
  const { pantry, addPantryItem } = useAppState();
  const [filter, setFilter] = useState('Alle');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const visible = pantry.filter(item => filter === 'Alle' || (filter === 'Knapp' && item.minimum && item.amount < item.minimum));

  const add = () => {
    if (!name.trim()) return;
    addPantryItem({ id: `pantry-${Date.now()}`, name: name.trim(), amount: 1, unit: 'Stk.', category: 'Sonstiges' });
    setName(''); setAdding(false);
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 30, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '800' }}>Vorrat</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['Alle', 'Knapp', 'Abgelaufen'].map(f => <Pressable key={f} onPress={() => setFilter(f)}><Pill active={filter === f}>{f}</Pill></Pressable>)}
      </View>
      <View style={{ borderTopWidth: 1, borderColor: theme.line }}>
        {visible.map(item => {
          const low = !!item.minimum && item.amount < item.minimum;
          return (
            <View key={item.id} style={{ minHeight: 56, borderBottomWidth: 1, borderColor: theme.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ width: 24, fontSize: 20 }}>{item.name === 'Milch' ? '🥛' : item.name === 'Eier' ? '🥚' : item.name === 'Spaghetti' ? '🍝' : item.name === 'Parmesan' ? '🧀' : item.name === 'Tomaten' ? '🍅' : item.name === 'Zwiebeln' ? '🧅' : '📦'}</Text>
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '600' }}>{item.name}</Text>{item.expiresAt ? <Text style={{ fontSize: 10, color: theme.greenDark }}>Ablauf: {item.expiresAt}</Text> : null}</View>
              <Text style={{ fontSize: 12, color: low ? theme.warning : theme.text }}>{low ? 'wenig' : `${item.amount} ${item.unit}`}</Text>
            </View>
          );
        })}
      </View>
      {adding ? <View style={{ flexDirection: 'row', gap: 8 }}><TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Produkt" style={{ flex: 1, borderWidth: 1, borderColor: theme.line, borderRadius: 12, minHeight: 48, paddingHorizontal: 13 }} /><Pressable onPress={add} style={{ backgroundColor: theme.green, borderRadius: 12, width: 48, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontSize: 22 }}>✓</Text></Pressable></View> : <PrimaryButton title="Produkt hinzufügen" icon="＋" onPress={() => setAdding(true)} />}
    </ScrollView>
  );
}
