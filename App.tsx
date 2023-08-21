import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import Ionicons from "@expo/vector-icons/Ionicons";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map(
          async (font) => await Font.loadAsync(font)
        );

        // Pre-Load images
        const imagesToLoad = [require("./assets/logo.png")];
        const imagePromises = imagesToLoad.map((image) =>
          Asset.loadAsync(image)
        );

        Promise.all([...fontPromises, ...imagePromises]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text>REACT NATIVE LEGGGO!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
