import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { Appearance, useColorScheme } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./styles";

SplashScreen.preventAutoHideAsync();

export default function App() {
  //grab color scheme and set state
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(colorScheme === "dark" ? true : false);
  }, [darkMode, setDarkMode]);

  // preload data
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

  //Subscribe for theme change
  Appearance.addChangeListener(({ colorScheme }) =>
    setDarkMode(colorScheme === "dark" ? true : false)
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <NavigationContainer onReady={onLayoutRootView}>
        <LoggedOutNav />
      </NavigationContainer>
    </ThemeProvider>
  );
}
