import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { Realm, useApp } from "@realm/react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Button from "../../components/Button";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";

import backgroundImage from "../../assets/background.png";

import { Container, Slogan, Title } from "./styles";

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const app = useApp();

  const [_, googleAuthenticationResponse, googleSignIn] = Google.useAuthRequest(
    {
      androidClientId: ANDROID_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      scopes: ["profile", "email"],
    }
  );

  function handleAuthenticationWithGoogle() {
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if (response.type !== "success") {
        setIsAuthenticating(false);
      }
    });
  }

  useEffect(() => {
    if (googleAuthenticationResponse?.type === "success") {
      if (googleAuthenticationResponse.authentication?.idToken) {
        const credentials = Realm.Credentials.jwt(
          googleAuthenticationResponse.authentication.idToken
        );

        app.logIn(credentials).catch((error) => {
          console.log(error);
          Alert.alert(
            "Autenticação",
            "Não foi possível conectar-se a sua conta Google."
          );
          setIsAuthenticating(false);
        });
      } else {
        Alert.alert(
          "Autenticação",
          "Não foi possível conectar-se a sua conta Google."
        );
        setIsAuthenticating(false);
      }
    }
  }, [googleAuthenticationResponse]);

  return (
    <Container source={backgroundImage}>
      <Title>Car Watch</Title>
      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        onPress={handleAuthenticationWithGoogle}
        isLoading={isAuthenticating}
      />
    </Container>
  );
}
