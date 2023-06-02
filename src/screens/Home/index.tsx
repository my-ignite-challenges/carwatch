import { useEffect, useState } from "react";

import { Alert, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Realm, useUser } from "@realm/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CloudArrowUp } from "phosphor-react-native";
import Toast from "react-native-toast-message";

import { CarStatus } from "../../components/CarStatus";
import { HistoryItem, HistoryItemProps } from "../../components/HistoryItem";
import { HomeHeader } from "../../components/HomeHeader";
import { TopMessage } from "../../components/TopMessage";

import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from "../../libs/asyncStorage";
import { useQuery, useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";

import { Container, Content, EmptyListMessage, Title } from "./styles";

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null);
  const [historyList, setHistoryList] = useState<HistoryItemProps[]>([]);
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

  const { navigate } = useNavigation();
  const history = useQuery(History);
  const realm = useRealm();
  const user = useUser();

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

  async function fetchHistory() {
    try {
      const response = history.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const lastDataSync = await getLastSyncTimestamp();

      const formattedHistoryData = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSynced: lastDataSync > item.updated_at!.getTime(),
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

  async function handleProgressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistory();
      setPercentageToSync(null);

      Toast.show({
        type: "info",
        text1: "Todos os dados estão sincronizados",
      });
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener("change", fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [history]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historyByUser = realm
        .objects("History")
        .filtered(`user_id = '${user!.id}'`);

      mutableSubs.add(historyByUser, { name: "history_by_user" });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      handleProgressNotification
    );

    return () =>
      syncSession.removeProgressNotification(handleProgressNotification);
  }, []);

  return (
    <Container>
      {percentageToSync && (
        <TopMessage message={percentageToSync} icon={CloudArrowUp} />
      )}
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
