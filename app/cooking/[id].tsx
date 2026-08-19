import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { foodImages } from '@/lib/images';
import { useAppState } from '@/state/app-state';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function helperText(stepText: string) {
  const value = stepText.toLowerCase();
  if (value.includes('speck') && value.includes('anbraten')) return 'Brate den Speck bei mittlerer Hitze, bis er knusprig und goldbraun ist.';
  if (value.includes('spaghetti') || value.includes('pasta')) return 'Achte auf die angegebene Garzeit und behalte etwas Kochwasser für die Sauce zurück.';
  if (value.includes('eier') || value.includes('parmesan')) return 'Verrühre alles gründlich zu einer glatten, cremigen Mischung.';
  if (value.includes('köcheln') || value.includes('schmoren')) return 'Lass das Gericht bei gleichmäßiger Hitze garen und rühre zwischendurch um.';
  return 'Arbeite diesen Schritt in Ruhe ab und prüfe Konsistenz und Gargrad, bevor du weitergehst.';
}

export default function CookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes } = useAppState();
  const recipe = recipes.find(r => r.id === id);
  const [index, setIndex] = useState(0);
  const step = recipe?.steps[index];
  const [remaining, setRemaining] = useState(step?.timerSeconds ?? 0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);

  useEffect(() => {
    setRemaining(step?.timerSeconds ?? 0);
    setRunning(false);
  }, [index, step?.timerSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running, remaining]);

  if (!recipe || !step) return null;

  const progress = ((index + 1) / recipe.steps.length) * 100;
  const hasTimer = !!step.timerSeconds;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
      style={{ flex: 1, backgroundColor: '#080A09' }}
      contentContainerStyle={{ minHeight: '100%', paddingHorizontal: 12, paddingTop: 48, paddingBottom: 28, backgroundColor: '#080A09' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <View style={{ width: 27, height: 27, borderRadius: 7, borderWidth: 2, borderColor: '#79C735', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="fork.knife" size={14} tintColor="#8AD73A" />
        </View>
        <Text selectable style={{ color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 }}>Cook<Text style={{ color: '#8AD73A' }}>Mate</Text></Text>
        <Pressable onPress={() => router.back()} style={{ marginLeft: 'auto', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="xmark" size={15} tintColor="#8D918E" />
        </Pressable>
      </View>

      <Text selectable style={{ color: '#AFC3A7', fontSize: 11, fontWeight: '700', marginTop: 7 }}>Schritt {index + 1} von {recipe.steps.length}</Text>
      <View style={{ height: 4, borderRadius: 4, backgroundColor: '#2D302E', marginTop: 5, overflow: 'hidden' }}>
        <View style={{ width: `${progress}%`, height: '100%', borderRadius: 4, backgroundColor: '#83CF35' }} />
      </View>

      <Text selectable style={{ color: 'white', fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 8 }}>{recipe.title}</Text>

      <Image
        source={hasTimer ? foodImages.pan : foodImages[recipe.imageKey]}
        style={{ width: '100%', height: 150, borderRadius: 13, marginTop: 8, borderCurve: 'continuous' }}
        contentFit="cover"
      />

      <Text selectable style={{ color: 'white', fontSize: 19, lineHeight: 21, fontWeight: '900', marginTop: 8 }}>{step.text}</Text>
      <Text selectable style={{ color: '#8D918E', fontSize: 11.5, lineHeight: 15, marginTop: 2 }}>{helperText(step.text)}</Text>

      {hasTimer ? (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Pressable
            onPress={() => setRunning(value => !value)}
            style={{
              width: 132,
              height: 132,
              borderRadius: 66,
              borderWidth: 1,
              borderColor: '#355027',
              backgroundColor: '#0B100C',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(129,205,51,0.12)'
            }}
          >
            <Text selectable style={{ color: '#88D33A', fontSize: 10, fontWeight: '900', letterSpacing: 0.4 }}>KOCHZEIT</Text>
            <Text selectable style={{ color: 'white', fontSize: 36, lineHeight: 42, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{formatTime(remaining)}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#8AD73A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={running ? 'pause.fill' : 'play.fill'} size={11} tintColor="#8AD73A" />
              </View>
              <Text selectable style={{ color: '#8AD73A', fontSize: 9, fontWeight: '900' }}>{running ? 'PAUSE' : 'START'}</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={{ height: 20 }} />
      )}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <Pressable
          disabled={index === 0}
          onPress={() => setIndex(value => Math.max(0, value - 1))}
          style={{ flex: 1, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#2D322E', backgroundColor: '#101311', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: index === 0 ? 0.45 : 1 }}
        >
          <Icon name="arrow.left" size={16} tintColor="white" />
          <Text selectable style={{ color: 'white', fontSize: 13, fontWeight: '800' }}>Zurück</Text>
        </Pressable>

        <Pressable
          onPress={() => index === recipe.steps.length - 1 ? router.back() : setIndex(value => value + 1)}
          style={{ flex: 1, height: 48, borderRadius: 10, backgroundColor: '#66B72D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Icon name={index === recipe.steps.length - 1 ? 'checkmark' : 'arrow.right'} size={16} tintColor="white" />
          <Text selectable style={{ color: 'white', fontSize: 13, fontWeight: '900' }}>{index === recipe.steps.length - 1 ? 'Fertig' : 'Weiter'}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => setVoice(value => !value)}
        style={{ height: 36, marginTop: 8, borderRadius: 9, backgroundColor: '#111412', borderWidth: 1, borderColor: '#252A26', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 8 }}
      >
        <Icon name="mic.fill" size={15} tintColor={voice ? '#7CCD36' : '#6D716E'} />
        <Text selectable style={{ flex: 1, color: voice ? '#949A94' : '#6D716E', fontSize: 10.5 }}>Sprachsteuerung {voice ? 'aktiv' : 'aus'}</Text>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: voice ? '#7CCD36' : '#555' }} />
      </Pressable>
    </ScrollView>
  );
}
