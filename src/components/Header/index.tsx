import { TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";

import { Container, Title } from "./styles";

type Props = {
  title: string;
};

export function Header({ title }: Props) {
  const { COLORS } = useTheme();
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const paddingTop = top + 42;

  return (
    <Container style={{ paddingTop }}>
      <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
        <ArrowLeft size={24} weight="bold" color={COLORS.BRAND_LIGHT} />
      </TouchableOpacity>

      <Title>{title}</Title>
    </Container>
  );
}
