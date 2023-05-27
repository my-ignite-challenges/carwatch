import { useRef, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useUser } from "@realm/react";

import Button from "../../components/Button";
import { Header } from "../../components/Header";
import { LicensePlateInput } from "../../components/LicensePlateInput";
import { TextArea } from "../../components/TextArea";

import { useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";
import { validateLicensePlate } from "../../utils/licensePlateValidation";

import { Container, Content } from "./styles";

export function Departure() {
  const [licensePlate, setLicensePlate] = useState("");
  const [description, setDescription] = useState("");
  const [isRegisteringDeparture, setIsRegisteringDeparture] = useState(false);

  const textAreaRef = useRef<TextInput>(null);
  const licensePlateInputRef = useRef<TextInput>(null);

  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  function handleDepartureRegistration() {
    try {
      const licensePlateIsValid = validateLicensePlate(licensePlate);

      if (!licensePlateIsValid) {
        licensePlateInputRef.current?.focus();
        return Alert.alert(
          "Validação de placa",
          "Placa inválida. Por favor informe a placa correta do veículo."
        );
      }

      if (description.trim().length === 0) {
        textAreaRef.current?.focus();
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade do uso do veículo."
        );
      }

      setIsRegisteringDeparture(true);

      realm.write(() => {
        realm.create(
          "History",
          History.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      Alert.alert("Registro de saída", "Saída Registrada com sucesso!");

      goBack();
    } catch (error) {
      return Alert.alert(
        "Registro de saída",
        "Não foi possível registrar a saída do veículo."
      );
    }
  }

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
              ref={licensePlateInputRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => textAreaRef.current?.focus()}
              returnKeyType="next"
              value={licensePlate}
              onChangeText={setLicensePlate}
            />
            <TextArea
              ref={textAreaRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegistration}
              returnKeyType="send"
              blurOnSubmit
              value={description}
              onChangeText={setDescription}
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegistration}
              isLoading={isRegisteringDeparture}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
