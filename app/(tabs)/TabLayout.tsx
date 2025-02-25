import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Icon library

import MainMenuScreen from "./index"; // ✅ Import Main Menu screen
import ExploreScreen from "./explore"; // ✅ Import Explore screen

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap; // ✅ Correct type

            if (route.name === "Home") {
              iconName = "home"; // ✅ Valid Ionicons name
            } else if (route.name === "Explore") {
              iconName = "compass"; // ✅ Valid Ionicons name
            } else {
              iconName = "help-circle"; // ✅ Default fallback
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: "#252525",
            borderTopWidth: 1,
            borderTopColor: "#444",
          },
          tabBarActiveTintColor: "#FFD700", // Gold color for active tab
          tabBarInactiveTintColor: "#CCC", // Grey for inactive tabs
        })}
      >
        <Tab.Screen name="Home" component={MainMenuScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
