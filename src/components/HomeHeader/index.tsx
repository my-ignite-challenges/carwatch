import { TouchableOpacity } from "react-native";

import { useApp, useUser } from "@realm/react";
import { Power } from "phosphor-react-native";

import theme from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container, Greeting, Message, Name, UserAvatar } from "./styles";

export function HomeHeader() {
  const user = useUser();
  const app = useApp();

  const safeAreaInsets = useSafeAreaInsets();

  const paddingTop = safeAreaInsets.top + 32;

  function handleLogout() {
    app.currentUser?.logOut();
  }

  return (
    <Container style={{ paddingTop }}>
      <UserAvatar
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj["
      />
      <Greeting>
        <Message>Olá</Message>
        <Name>{user?.profile.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power color={theme.COLORS.GRAY_400} size={32} />
      </TouchableOpacity>
    </Container>
  );
}
