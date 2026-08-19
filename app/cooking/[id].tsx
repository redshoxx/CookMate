import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { foodImages } from '@/lib/images';
import { useAppState } from '@/state/app-state';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

function helperText(stepText: string) {
  const value = stepText.toLowerCase();
  if (value.includes('speck') && value.includes('anbraten')) return 'Brate den Speck bei mittlerer Hitze, bis er knusprig und goldbraun ist.';
  if (value.includes('spaghetti') || value.includes('pasta')) return 'Achte auf die Garzeit und behalte etwas Kochwasser für die Sauce zurück.';
  if (value.includes('eier') || value.includes('parmesan')) return 'Verrühre alles gründlich zu einer glatten, cremigen Mischung.';
  if (value.includes('köcheln') || value.includes('schmoren')) return 'Lass das Gericht bei gleichmäßiger Hitze garen und rühre zwischendurch um.';
  return 'Arbeite diesen Schritt vollständig ab und prüfe Konsistenz und Gargrad, bevor du weitergehst.';
}

export default function CookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes } = useAppState();
  const recipe = recipes.find(item => item.id === id);
  const [index, setIndex] = useState(0);
  const step = recipe?.steps[index];
  const [remaining, setRemaining] = useState(step?.timerSeconds ?? 0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(step?.timerSeconds ?? 0);
    setRunning(false);
  }, [index, step?.timerSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0 && running) setRunning(false);
  }, [remaining, running]);

  if (!recipe || !step) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080A09', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Text style={{ color: 'white', fontWeight: '800' }}>Kochschritt nicht verfügbar.</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: '#83CF35', fontWeight: '800' }}>Zurück</Text></Pressable>
      </View>
    );
  }

  const progress = ((index + 1) / recipe.steps.length) * 100;
  const hasTimer = !!step.timerSeconds;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" bounces={false} style={{ flex: 1, backgroundColor: '#080A09' }} contentContainerStyle={{ minHeight: '100%', paddingHorizontal: 12, paddingTop: 48, paddingBottom: 28, backgroundColor: '#080A09' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <View style={{ width: 29, height: 29, borderRadius: 8, borderWidth: 2, borderColor: '#79C735', alignItems: 'center', justifyContent: 'center' }}><Icon name="fork.knife" size={14} tintColor="#8AD73A" /></View>
        <Text selectable style={{ color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 }}>Cook<Text style={{ color: '#8AD73A' }}>Mate</Text></Text>
        <Pressable onPress={() => router.back()} style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: '#141714', alignItems: 'center', justifyContent: 'center' }}><Icon name="xmark" size={14} tintColor="#A4A8A4" /></Pressable>
      </View>

      <Text selectable style={{ color: '#AFC3A7', fontSize: 11, fontWeight: '700', marginTop: 7 }}>Schritt {index + 1} von {recipe.steps.length}</Text>
      <View style={{ height: 4, borderRadius: 4, backgroundColor: '#2D302E', marginTop: 5, overflow: 'hidden' }}><View style={{ width: `${progress}%`, height: '100%', borderRadius: 4, backgroundColor: '#83CF35' }} /></View>

      <Text selectable style={{ color: 'white', fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 8 }}>{recipe.title}</Text>
      <Image source={hasTimer ? foodImages.pan : (foodImages[recipe.imageKey] ?? foodImages.carbonara)} style={{ width: '100%', height: 180, borderRadius: 15, marginTop: 9 }} contentFit="cover" transition={150} />

      <Text selectable style={{ color: 'white', fontSize: 22, lineHeight: 25, fontWeight: '900', marginTop: 12 }}>{step.text}</Text>
      <Text selectable style={{ color: '#9CA09C', fontSize: 12, lineHeight: 17, marginTop: 4 }}>{helperText(step.text)}</Text>

      {hasTimer ? (
        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <Pressable onPress={() => setRunning(value => !value)} style={({ pressed }) => ({ width: 144, height: 144, borderRadius: 72, borderWidth: 1, borderColor: '#3B5B2A', backgroundColor: '#0B100C', alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.82 : 1, boxShadow: '0 0 28px rgba(129,205,51,0.12)' })}>
            <Text selectable style={{ color: '#88D33A', fontSize: 10, fontWeight: '900', letterSpacing: 0.4 }}>KOCHZEIT</Text>
            <Text selectable style={{ color: 'white', fontSize: 38, lineHeight: 44, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{formatTime(remaining)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#8AD73A', alignItems: 'center', justifyContent: 'center' }}><Icon name={running ? 'pause.fill' : 'play.fill'} size={11} tintColor="#8AD73A" /></View>
              <Text selectable style={{ color: '#8AD73A', fontSize: 9, fontWeight: '900' }}>{running ? 'PAUSE' : remaining === 0 ? 'FERTIG' : 'START'}</Text>
            </View>
          </Pressable>
        </View>
      ) : <View style={{ height: 36 }} />}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Pressable disabled={index === 0} onPress={() => setIndex(value => Math.max(0, value - 1))} style={{ flex: 1, height: 50, borderRadius: 11, borderWidth: 1, borderColor: '#2D322E', backgroundColor: '#101311', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: index === 0 ? 0.4 : 1 }}>
          <Icon name="arrow.left" size={16} tintColor="white" />
          <Text selectable style={{ color: 'white', fontSize: 13, fontWeight: '800' }}>Zurück</Text>
        </Pressable>
        <Pressable onPress={() => index === recipe.steps.length - 1 ? router.back() : setIndex(value => value + 1)} style={({ pressed }) => ({ flex: 1, height: 50, borderRadius: 11, backgroundColor: '#66B72D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pressed ? 0.82 : 1 })}>
          <Icon name={index === recipe.steps.length - 1 ? 'checkmark' : 'arrow.right'} size={16} tintColor="white" />
          <Text selectable style={{ color: 'white', fontSize: 13, fontWeight: '900' }}>{index === recipe.steps.length - 1 ? 'Fertig' : 'Weiter'}</Text>
        </Pressable>
      </View>

      <View style={{ minHeight: 38, marginTop: 10, borderRadius: 10, backgroundColor: '#111412', borderWidth: 1, borderColor: '#252A26', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 8 }}>
        <Icon name="hand.tap.fill" size={15} tintColor="#7CCD36" />
        <Text selectable style={{ flex: 1, color: '#949A94', fontSize: 10.5 }}>Kochmodus aktiv · Schritte und Timer sind direkt bedienbar</Text>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#7CCD36' }} />
      </View>
    </ScrollView>
  );
}
