import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function formatTime(seconds: number) { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; }

export default function CookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes } = useAppState();
  const recipe = recipes.find(r => r.id === id);
  const [index, setIndex] = useState(0);
  const step = recipe?.steps[index];
  const [remaining, setRemaining] = useState(step?.timerSeconds ?? 0);
  const [running, setRunning] = useState(false);

  useEffect(() => { setRemaining(step?.timerSeconds ?? 0); setRunning(false); }, [index]);
  useEffect(() => { if (!running || remaining <= 0) return; const t = setInterval(() => setRemaining(v => v - 1), 1000); return () => clearInterval(t); }, [running, remaining]);
  if (!recipe || !step) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#101010', paddingTop: 58, paddingHorizontal: 20, paddingBottom: 34 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Pressable onPress={() => router.back()} style={{ padding: 5 }}><Icon name="chevron.left" tintColor="white" /></Pressable><Text style={{ color: 'white', fontWeight: '700' }}>{recipe.title}</Text><View style={{ width: 30 }} /></View>
      <View style={{ flexDirection: 'row', gap: 5, marginTop: 18 }}>{recipe.steps.map((_, i) => <View key={i} style={{ height: 3, flex: 1, borderRadius: 2, backgroundColor: i <= index ? theme.green : '#4A4A4A' }} />)}</View>
      <Text style={{ color: '#B9B9B9', fontSize: 12, textAlign: 'center', marginTop: 22 }}>Schritt {index + 1} von {recipe.steps.length}</Text>
      <Text style={{ color: 'white', fontSize: 28, lineHeight: 35, fontWeight: '800', textAlign: 'center', marginTop: 26, paddingHorizontal: 18 }}>{step.text}</Text>
      <Image source={step.timerSeconds ? foodImages.pan : foodImages[recipe.imageKey]} style={{ width: '100%', height: 265, borderRadius: 28, marginTop: 30 }} contentFit="cover" />
      {step.timerSeconds ? <Pressable onPress={() => setRunning(v => !v)} style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 }}><Icon name={running ? 'pause.circle' : 'timer'} tintColor="white" size={30} /><Text style={{ color: 'white', fontSize: 31, fontVariant: ['tabular-nums'] }}>{formatTime(remaining)}</Text></Pressable> : <View style={{ flex: 1 }} />}
      <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 10 }}><Pressable onPress={() => setIndex(i => Math.max(0, i - 1))} style={{ flex: 1, height: 52, backgroundColor: '#2A2A2A', borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontWeight: '700' }}>Zurück</Text></Pressable><Pressable onPress={() => index === recipe.steps.length - 1 ? router.back() : setIndex(i => i + 1)} style={{ flex: 1, height: 52, backgroundColor: theme.green, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontWeight: '700' }}>{index === recipe.steps.length - 1 ? 'Fertig' : 'Weiter'}</Text></Pressable></View>
    </View>
  );
}
