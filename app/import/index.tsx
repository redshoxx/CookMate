import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { importRecipeFromUrl } from '@/lib/recipe-import';
import { theme } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function ImportScreen() {
  const { addRecipe } = useAppState();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const importUrl = async () => {
    const value = url.trim();
    if (!value || busy) return;
    setBusy(true);
    setError('');
    try {
      const recipe = await importRecipeFromUrl(value);
      addRecipe(recipe);
      router.replace({ pathname: '/recipe/[id]', params: { id: recipe.id } });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Das Rezept konnte nicht importiert werden.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 34, gap: 16, backgroundColor: theme.bg }}>
      <View style={{ backgroundColor: 'white', borderRadius: 22, borderWidth: 1, borderColor: theme.line, padding: 18, gap: 14 }}>
        <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: theme.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="link" size={22} tintColor={theme.greenDark} />
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 21, fontWeight: '900' }}>Rezept aus Link importieren</Text>
          <Text style={{ color: theme.muted, lineHeight: 19 }}>Füge eine öffentliche Rezept-URL ein. CookMate übernimmt verfügbare Rezeptdaten und speichert sie lokal.</Text>
        </View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          onSubmitEditing={importUrl}
          editable={!busy}
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          placeholderTextColor="#9A9D98"
          style={{ minHeight: 50, borderWidth: 1, borderColor: error ? theme.danger : theme.line, backgroundColor: '#FAFBF9', borderRadius: 14, paddingHorizontal: 13, color: theme.text }}
        />
        {error ? (
          <View style={{ flexDirection: 'row', gap: 8, borderRadius: 12, backgroundColor: '#FFF1F0', padding: 11 }}>
            <Icon name="exclamationmark.circle.fill" size={16} tintColor={theme.danger} />
            <Text selectable style={{ flex: 1, color: theme.danger, fontSize: 12, lineHeight: 17 }}>{error}</Text>
          </View>
        ) : null}
        <PrimaryButton title={busy ? 'Import wird geprüft …' : 'Rezept importieren'} onPress={importUrl} />
      </View>

      <View style={{ backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: theme.line, padding: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="lock.shield.fill" size={19} tintColor={theme.greenDark} />
          <Text style={{ fontWeight: '900' }}>Sauberer Import</Text>
        </View>
        <Text style={{ color: theme.muted, fontSize: 12, lineHeight: 18 }}>Es wird nur ein Rezept angelegt, wenn verwertbare Rezeptdaten gefunden wurden. Fehlschläge erzeugen keine leeren Einträge.</Text>
      </View>

      <Pressable onPress={() => router.back()} style={{ alignSelf: 'center', padding: 8 }}>
        <Text style={{ color: theme.greenDark, fontWeight: '800' }}>Abbrechen</Text>
      </Pressable>
    </ScrollView>
  );
}
