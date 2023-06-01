import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";

import { ButtonIconProps } from "../IconButton";

import { Container, Message } from "./styles";

type Props = {
  icon?: ButtonIconProps;
  message: string;
};

export function TopMessage({ icon: Icon, message }: Props) {
  const { COLORS } = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 5;

  return (
    <Container style={{ paddingTop }}>
      {Icon && <Icon size={18} color={COLORS.GRAY_100} />}
      <Message>{message}</Message>
    </Container>
  );
}
