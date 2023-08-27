import React from "react";
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
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { darkModeVar, isLoggedInVar, tokenVar } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { persistCache, AsyncStorageWrapper } from "apollo3-cache-persist";
import { cache } from "./apollo";

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

export default function App() {
  //grab color scheme and set state
  const colorScheme = useColorScheme();
  const darkMode = useReactiveVar(darkModeVar);

  useEffect(() => {
    darkModeVar(colorScheme === "dark" ? true : false);
  }, [darkModeVar]);

  //check if user is logged in
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  // preload data
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    //prepare all the pre-loads
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map(
          async (font) => await Font.loadAsync(font)
        );

        // Restore token from cache, and log in if token exists
        const token = await AsyncStorage.getItem("token");
        if (token) {
          isLoggedInVar(true);
          tokenVar(token);
        }

        // Store cache data
        await persistCache({
          cache,
          storage: new AsyncStorageWrapper(AsyncStorage),
        });

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
    darkModeVar(colorScheme === "dark" ? true : false)
  );

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <NavigationContainer onReady={onLayoutRootView}>
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
}
