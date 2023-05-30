import { Alert } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";
import { BSON } from "realm";

import Button from "../../components/Button";
import { Header } from "../../components/Header";
import { IconButton } from "../../components/IconButton";

import { useObject, useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";

type RouteParamProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { id } = route.params as RouteParamProps;
  const { goBack } = useNavigation();

  const history = useObject(History, new BSON.UUID(id));
  const realm = useRealm();

  function removeVehicleUsageRecord() {
    realm.write(() => {
      realm.delete(history);
    });

    goBack();
  }

  function handleUsageRecordRemovalConfirmation() {
    Alert.alert(
      "Remoção de Registro de Uso",
      "Deseja realmente remover esse dados de uso do veículo?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => removeVehicleUsageRecord() },
      ]
    );
  }

  return (
    <Container>
      <Header title="Chegada" />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        <Description>{history?.description}</Description>

        <Footer>
          <IconButton icon={X} onPress={handleUsageRecordRemovalConfirmation} />
          <Button title="Registrar Chegada" />
        </Footer>
      </Content>
    </Container>
  );
}
