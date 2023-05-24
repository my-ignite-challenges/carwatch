import { TouchableOpacityProps } from "react-native";

import { Container, Spinner, Title } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export default function Button({ title, isLoading = false, ...props }: Props) {
  return (
    <Container activeOpacity={0.7} {...props} disabled={isLoading}>
      {isLoading ? <Spinner /> : <Title>{title}</Title>}
    </Container>
  );
}
