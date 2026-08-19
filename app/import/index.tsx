import { useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { foodImages } from '@/lib/images';
import { importRecipeFromUrl } from '@/lib/recipe-import';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function ImportScreen() {
  const { addRecipe } = useAppState();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const importUrl = async () => {
    if (!url.trim()) return;
    setBusy(true); setError('');
    try { const recipe = await importRecipeFromUrl(url.trim()); addRecipe(recipe); router.replace({ pathname: '/recipe/[id]', params: { id: recipe.id } }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Import fehlgeschlagen.'); }
    finally { setBusy(false); }
  };
  const choosePhoto = async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 }); if (!r.canceled) setPhoto(r.assets[0].uri); };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 22 }}>
      <View style={{ gap: 9 }}><Text style={{ fontWeight: '800', fontSize: 14 }}>Füge den Link zum Rezept ein</Text><TextInput autoCapitalize="none" keyboardType="url" value={url} onChangeText={setUrl} placeholder="https://www.chefkoch.de/..." style={{ minHeight: 48, borderWidth: 1, borderColor: theme.line, borderRadius: 12, paddingHorizontal: 13 }} /><PrimaryButton title={busy ? 'Importiere…' : 'Importieren'} onPress={importUrl} /></View>
      {error ? <Text selectable style={{ color: theme.danger, fontSize: 13 }}>{error}</Text> : null}
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}><View style={{ height: 1, flex: 1, backgroundColor: theme.line }} /><Text style={{ color: theme.muted, fontSize: 12 }}>Oder Rezept aus Foto</Text><View style={{ height: 1, flex: 1, backgroundColor: theme.line }} /></View>
      {photo ? <Image source={{ uri: photo }} style={{ height: 180, width: '100%', borderRadius: 16 }} contentFit="cover" /> : null}
      <Pressable onPress={choosePhoto} style={{ minHeight: 52, borderWidth: 1, borderColor: theme.line, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}><Icon name="photo" size={17} /><Text style={{ fontWeight: '600' }}>Foto auswählen</Text></Pressable>
      <View style={{ gap: 10, marginTop: 6 }}><Text style={{ fontWeight: '800' }}>Zuletzt importiert</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><Image source={foodImages.bread} style={{ width: 56, height: 56, borderRadius: 12 }} contentFit="cover" /><View><Text style={{ fontWeight: '700' }}>Dinkelbrot</Text><Text style={{ color: theme.muted, fontSize: 12 }}>Beispiel</Text></View></View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><Image source={foodImages.soup} style={{ width: 56, height: 56, borderRadius: 12 }} contentFit="cover" /><View><Text style={{ fontWeight: '700' }}>Zucchini Suppe</Text><Text style={{ color: theme.muted, fontSize: 12 }}>Beispiel</Text></View></View></View>
    </ScrollView>
  );
}
