import { Image } from 'expo-image';
import { StyleProp, ViewStyle } from 'react-native';

export function Icon({ name, size = 21, tintColor = '#111', style }: { name: string; size?: number; tintColor?: string; style?: StyleProp<ViewStyle> }) {
  return <Image source={`sf:${name}`} style={[{ width: size, height: size }, style]} tintColor={tintColor} contentFit="contain" />;
}
