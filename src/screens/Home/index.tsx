import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../../components/HomeHeader";

import { useQuery, useRealm } from "../../libs/realm";
import { History } from "../../libs/realm/schemas/History";

import { Container, Content } from "./styles";

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<History | null>(null);

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
        "Veículos em uso",
        "Não foi possível carregar a lista de veículos em uso"
      );
    }
  }

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => realm.removeListener("change", fetchVehicleInUse);
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleNavigation}
          licensePlate={vehicleInUse?.license_plate}
        />
      </Content>
    </Container>
  );
}
