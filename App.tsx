import { StatusBar } from "react-native";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { AppProvider, UserProvider } from "@realm/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import { Loading } from "./src/components/Loading";
import { SignIn } from "./src/screens/SignIn";

import { REALM_APP_ID } from "@env";
import { RealmProvider } from "./src/libs/realm";
import { Routes } from "./src/routes";
import theme from "./src/theme";

type Props = {
  title: string;
};

export default function App() {
  const [fontsHaveBeenLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

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
          <UserProvider fallback={<SignIn />}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
