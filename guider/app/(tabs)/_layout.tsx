import { Tabs } from 'expo-router';
import { CircleHelp, House, Settings2 } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6200',
        tabBarInactiveTintColor: '#A4ADBA',
        tabBarStyle: {
          height: 74,
          backgroundColor: '#111820',
          borderTopColor: '#263241',
          paddingTop: 8,
          paddingBottom: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings2 color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <CircleHelp color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
