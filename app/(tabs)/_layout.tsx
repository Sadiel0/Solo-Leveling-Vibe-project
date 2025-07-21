import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.dark.backgroundVariant,
          borderTopColor: Colors.dark.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SYSTEM',
          tabBarIcon: ({ color }) => <TabBarIcon name="shield-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mind"
        options={{
          title: 'MIND',
          tabBarIcon: ({ color }) => <TabBarIcon name="school-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="body"
        options={{
          title: 'BODY',
          tabBarIcon: ({ color }) => <TabBarIcon name="barbell-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="spirit"
        options={{
          title: 'SPIRIT',
          tabBarIcon: ({ color }) => <TabBarIcon name="infinite" color={color} />,
        }}
      />
    </Tabs>
  );
}
