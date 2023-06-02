import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";
import { BSON } from "realm";

import Button from "../../components/Button";
import { Header } from "../../components/Header";
import { IconButton } from "../../components/IconButton";

import { getLastSyncTimestamp } from "../../libs/asyncStorage";
import { useObject, useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";

import {
  ConnectionStatusMessage,
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
  const [hasDataBeenSynced, setHasDataBeenSynced] = useState(false);

  const route = useRoute();
  const { id } = route.params as RouteParamProps;
  const { goBack } = useNavigation();

  const history = useObject(History, new BSON.UUID(id));
  const realm = useRealm();

  const headerTitle = history?.status === "departure" ? "Chegada" : "Detalhes";

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

  function handleArrivalRegistration() {
    try {
      if (!history) {
        Alert.alert("Erro", "Não foi possível obter os dados do veículo.");
      } else {
        realm.write(() => {
          (history.status = "arrival"), (history.updated_at = new Date());
        });

        Alert.alert("Chegada", "Chegada registrada com sucesso!");
        goBack();
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar a chegada.");
    }
  }

  useEffect(() => {
    getLastSyncTimestamp().then((lastSync) => {
      setHasDataBeenSynced(lastSync > history!.updated_at.getTime());
    });
  }, []);

  return (
    <Container>
      <Header title={headerTitle} />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        <Description>{history?.description}</Description>
      </Content>

      {history?.status === "departure" && (
        <Footer>
          <IconButton icon={X} onPress={handleUsageRecordRemovalConfirmation} />
          <Button
            title="Registrar Chegada"
            onPress={handleArrivalRegistration}
          />
        </Footer>
      )}

      {!hasDataBeenSynced && (
        <ConnectionStatusMessage>
          Sincronização de dados da{" "}
          {history?.status === "departure" ? "partida" : "chegada"} pendente.
        </ConnectionStatusMessage>
      )}
    </Container>
  );
}
