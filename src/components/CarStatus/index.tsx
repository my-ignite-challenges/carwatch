import { TouchableOpacityProps } from "react-native";

import { Container, IconBox, Message, TextHighlight } from "./styles";

import { Car, Key } from "phosphor-react-native";
import { useTheme } from "styled-components/native";

type Props = TouchableOpacityProps & {
  licensePlate?: string;
};

export function CarStatus({ licensePlate, ...props }: Props) {
  const Icon = licensePlate ? Car : Key;
  const message = licensePlate
    ? `Veículo com placa ${licensePlate} está em uso.`
    : "Nenhum veículo em uso.";
  const statusLabel = licensePlate ? "chegada." : "saída.";

  const { COLORS } = useTheme();

  return (
    <Container {...props}>
      <IconBox>
        <Icon size={52} color={COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>
        {message}{" "}
        <TextHighlight>
          Clique aqui para registrar a {statusLabel}
        </TextHighlight>
      </Message>
    </Container>
  );
}
