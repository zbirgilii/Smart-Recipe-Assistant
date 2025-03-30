import { Slot } from "expo-router";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
import SplashScreenComponent from "./SplashScreenComponent";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // If app is not ready, show splash screen
  if (!isAppReady) {
    return <SplashScreenComponent />;
  }

  // Once ready, render the rest of the app
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}