import { TouchableOpacityProps } from "react-native";

import { IconProps } from "phosphor-react-native";
import { useTheme } from "styled-components/native";

import { Container } from "./styles";

export type ButtonIconProps = (props: IconProps) => JSX.Element;

type Props = TouchableOpacityProps & {
  icon: ButtonIconProps;
};

export function IconButton({ icon: Icon, ...props }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...props}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Container>
  );
}
