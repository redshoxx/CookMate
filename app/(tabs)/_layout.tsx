import { Tabs } from 'expo-router';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';

const icon = (name: string) => ({ color }: { color: string }) => <Icon name={name} size={21} tintColor={color} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.green, tabBarInactiveTintColor: '#707070', headerShadowVisible: false, tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }, tabBarStyle: { borderTopColor: '#ECECEE', height: 83, paddingTop: 5 } }}>
      <Tabs.Screen name="index" options={{ title: 'Heute', headerShown: false, tabBarIcon: icon('house.fill') }} />
      <Tabs.Screen name="recipes" options={{ title: 'Rezepte', headerShown: false, tabBarIcon: icon('book.closed.fill') }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan', headerShown: false, tabBarIcon: icon('calendar') }} />
      <Tabs.Screen name="shopping" options={{ title: 'Einkauf', headerShown: false, tabBarIcon: icon('cart.fill') }} />
      <Tabs.Screen name="pantry" options={{ title: 'Vorrat', headerShown: false, tabBarIcon: icon('shippingbox.fill') }} />
    </Tabs>
  );
}
