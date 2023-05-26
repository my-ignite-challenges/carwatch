import { useRef } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

import Button from "../../components/Button";
import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextArea } from "../../components/TextArea";

import { Container, Content } from "./styles";

export function Departure() {
  const textAreaRef = useRef<TextInput>(null);

  function handleDepartureRegistration() {}

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <Content>
            <LicensePlateInput
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => textAreaRef.current?.focus()}
              returnKeyType="next"
            />
            <TextArea
              ref={textAreaRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegistration}
              returnKeyType="send"
              blurOnSubmit
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegistration}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
