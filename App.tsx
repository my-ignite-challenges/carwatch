import "react-native-get-random-values";

import { StatusBar } from "react-native";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useNetInfo } from "@react-native-community/netinfo";
import { AppProvider, UserProvider } from "@realm/react";
import { WifiSlash } from "phosphor-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import { Loading } from "./src/components/Loading";
import { TopMessage } from "./src/components/TopMessage";
import { SignIn } from "./src/screens/SignIn";

import { REALM_APP_ID } from "@env";
import { RealmProvider, syncConfig } from "./src/libs/realm";
import { Routes } from "./src/routes";
import theme from "./src/theme";

export default function App() {
  const [fontsHaveBeenLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const netInfo = useNetInfo();

  if (!fontsHaveBeenLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {!netInfo.isConnected && (
            <TopMessage message="Você está offline." icon={WifiSlash} />
          )}
          <UserProvider fallback={<SignIn />}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
