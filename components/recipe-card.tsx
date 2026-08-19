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
      <Pressable
        style={({ pressed }) => ({
          flex: 1,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: theme.line,
          opacity: pressed ? 0.88 : 1,
          boxShadow: '0 3px 12px rgba(25, 48, 24, 0.06)'
        })}
      >
        <View style={{ height: 132, backgroundColor: '#EEF1EC' }}>
          <Image source={foodImages[recipe.imageKey] ?? foodImages.carbonara} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={180} />
          <Pressable
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onFavorite?.();
            }}
            style={{ position: 'absolute', right: 9, top: 9, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,.95)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={recipe.favorite ? 'heart.fill' : 'heart'} size={17} tintColor={recipe.favorite ? theme.green : '#353735'} />
          </Pressable>
        </View>
        <View style={{ padding: 11, gap: 6 }}>
          <Text numberOfLines={2} style={{ fontWeight: '800', fontSize: 14, minHeight: 34, color: theme.text }}>{recipe.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="clock" size={11} tintColor={theme.muted} />
            <Text style={{ color: theme.muted, fontSize: 11 }}>{recipe.minutes} Min. · {recipe.difficulty}</Text>
          </View>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9, backgroundColor: theme.greenSoft }}>
            <Text style={{ color: theme.greenDark, fontWeight: '700', fontSize: 10 }}>{recipe.category}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
