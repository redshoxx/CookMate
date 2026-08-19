import { Tabs } from 'expo-router';
import { Icon } from '@/components/icon';
import { theme } from '@/lib/theme';

const icon = (name: string) => ({ color }: { color: string }) => <Icon name={name} size={21} tintColor={color} />;

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="plan"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.green,
        tabBarInactiveTintColor: '#777B76',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarStyle: {
          borderTopColor: '#E9ECE7',
          backgroundColor: '#FFFFFF',
          height: 84,
          paddingTop: 7
        }
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen name="plan" options={{ title: 'Wochenplan', tabBarIcon: icon('calendar') }} />
      <Tabs.Screen name="shopping" options={{ title: 'Einkaufsliste', tabBarIcon: icon('list.bullet') }} />
      <Tabs.Screen name="pantry" options={{ title: 'Vorrat', tabBarIcon: icon('shippingbox.fill') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: icon('person') }} />
    </Tabs>
  );
}
