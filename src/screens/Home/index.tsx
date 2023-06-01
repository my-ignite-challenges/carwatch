import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { CarStatus } from "../../components/CarStatus";
import { HistoryItem, HistoryItemProps } from "../../components/HistoryItem";
import { HomeHeader } from "../../components/HomeHeader";

import { useQuery, useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";

import { Container, Content, EmptyListMessage, Title } from "./styles";
import { FlatList } from "react-native";

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItemProps[]>([]);

  const { navigate } = useNavigation();
  const history = useQuery(History);
  const realm = useRealm();

  function handleNavigation() {
    vehicleInUse?._id
      ? navigate("Arrival", { id: vehicleInUse?._id.toString() })
      : navigate("Departure");
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = history.filtered("status = 'departure'")[0];

      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert(
        "Veículo em uso",
        "Não foi possível carregar os dados do veículo em uso"
      );
    }
  }

  function fetchHistory() {
    try {
      const response = history.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const formattedHistoryData = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSynced: false,
          createdAt: format(
            item.created_at,
            "'Saída em' dd/MM/yyyy 'às' HH:mm",
            {
              locale: ptBR,
            }
          ),
        };
      });

      setHistoryList(formattedHistoryData);
    } catch (error) {
      Alert.alert(
        "Histórico",
        "Não foi possível carregar os dados do histórico."
      );
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => realm.removeListener("change", fetchVehicleInUse);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [history]);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleNavigation}
          licensePlate={vehicleInUse?.license_plate}
        />

        <Title>Histórico</Title>

        <FlatList
          data={historyList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem
              data={item}
              onPress={() => navigate("Arrival", { id: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={() => (
            <EmptyListMessage>Nenhum registro de uso.</EmptyListMessage>
          )}
        />
      </Content>
    </Container>
  );
}
