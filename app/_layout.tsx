import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync({
          SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        console.warn("Error loading fonts:", e);
      } finally {
        setIsReady(true);
      }
    }

    loadResources();
  }, []);

  // Hide splash screen when ready
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (isReady) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn("Error hiding splash screen:", e);
        }
      }
    };

    hideSplashScreen();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#1f2937" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}