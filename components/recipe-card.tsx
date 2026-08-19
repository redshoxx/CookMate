import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { foodImages } from '@/lib/images';
import { theme } from '@/lib/theme';
import { Recipe } from '@/types/models';
import { Icon } from './icon';

export function RecipeCard({ recipe, onFavorite }: { recipe: Recipe; onFavorite?: () => void }) {
  return (
    <Link href={{ pathname: '/recipe/[id]', params: { id: recipe.id } }} asChild>
      <Pressable style={({ pressed }) => ({ flex: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: 'white', borderWidth: 1, borderColor: theme.line, opacity: pressed ? 0.9 : 1 })}>
        <View style={{ height: 118, backgroundColor: '#EEE' }}>
          <Image source={foodImages[recipe.imageKey] ?? foodImages.carbonara} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <Pressable onPress={(e) => { e.stopPropagation(); onFavorite?.(); }} style={{ position: 'absolute', right: 8, top: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,.92)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={recipe.favorite ? 'heart.fill' : 'heart'} size={16} tintColor={recipe.favorite ? '#D92D20' : '#222'} />
          </Pressable>
        </View>
        <View style={{ padding: 10, gap: 3 }}>
          <Text numberOfLines={2} style={{ fontWeight: '700', fontSize: 14, minHeight: 34 }}>{recipe.title}</Text>
          <Text style={{ color: theme.muted, fontSize: 11 }}>{recipe.minutes} Min.</Text>
        </View>
      </Pressable>
    </Link>
  );
}
