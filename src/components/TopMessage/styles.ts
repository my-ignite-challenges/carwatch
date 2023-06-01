import { Dimensions } from "react-native";

import styled, { css } from "styled-components/native";

const dimensions = Dimensions.get("window");

export const Container = styled.View`
  width: ${dimensions.width}px;
  position: absolute;
  z-index: 1;
  padding-bottom: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
`;

export const Message = styled.Text`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_100};
    font-size: ${theme.FONT_SIZE.SM}px;
    font-family: ${theme.FONT_FAMILY.REGULAR};
  `}
  margin-left: 4px;
`;
