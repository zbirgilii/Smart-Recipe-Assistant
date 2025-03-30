import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#252525",
          borderTopWidth: 1,
          borderTopColor: "#444",
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#CCC",
      }}
    >
      <Tabs.Screen
        name="mainMenu"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}



