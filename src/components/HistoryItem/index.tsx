import { TouchableOpacityProps, View } from "react-native";

import { Check, ClockClockwise } from "phosphor-react-native";
import { useTheme } from "styled-components/native";

import { Container, DepartureDate, Info, LicensePlate } from "./styles";

export type HistoryItemProps = {
  id: string;
  licensePlate: string;
  createdAt: string;
  isSynced: boolean;
};

type Props = TouchableOpacityProps & {
  data: HistoryItemProps;
};

export function HistoryItem({ data, ...props }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...props}>
      <Info>
        <LicensePlate>{data.licensePlate}</LicensePlate>
        <DepartureDate>{data.createdAt}</DepartureDate>
      </Info>
      {data.isSynced ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </Container>
  );
}
