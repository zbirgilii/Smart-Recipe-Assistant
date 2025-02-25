import { Stack } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import SplashScreenComponent from "../app/SplashScreenComponent"; // ✅ Correct path
import NavigationBar from "../app/(tabs)/TabLayout"; 

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }, 3000); // ✅ Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <SplashScreenComponent />; // ✅ Show splash first
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NavigationBar" options={{ headerShown: false }} /> {/* ✅ Load new navbar */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
