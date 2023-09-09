import { ImageProps } from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../../styles";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../../apollo";
import { Ionicons } from "@expo/vector-icons";

const SmallAvatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const MediumAvatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const LargeAvatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

const NoAvatar = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${(props: IThemeProps) => props.theme.grayLight};
`;

const SmallNoAvatar = styled(NoAvatar)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const MediumNoAvatar = styled(NoAvatar)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const LargeNoAvatar = styled(NoAvatar)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

interface IAvatarProps {
  avatarUrl?: string | null;
  size?: "small" | "large";
  focused?: boolean;
  [key: string]: any;
}

const avatarSized = (
  avatarUrl: string,
  size?: "small" | "large",
  focused?: boolean,
  darkMode?: boolean
) => {
  return size === "small" ? (
    <SmallAvatar
      resizeMode="cover"
      source={{ uri: avatarUrl }}
      style={{
        ...(focused && {
          borderWidth: 1,
          borderColor: darkMode ? darkTheme.fontColor : lightTheme.fontColor,
        }),
      }}
    />
  ) : size === "large" ? (
    <LargeAvatar
      resizeMode="cover"
      source={{ uri: avatarUrl }}
      style={{
        ...(focused && {
          borderWidth: 1,
          borderColor: darkMode ? darkTheme.fontColor : lightTheme.fontColor,
        }),
      }}
    />
  ) : (
    <MediumAvatar
      resizeMode="cover"
      source={{ uri: avatarUrl }}
      style={{
        ...(focused && {
          borderWidth: 1,
          borderColor: darkMode ? darkTheme.fontColor : lightTheme.fontColor,
        }),
      }}
    />
  );
};

const noAvatarSized = (
  size?: "small" | "large" | undefined,
  darkMode?: boolean
) => {
  return size === "small" ? (
    <SmallNoAvatar>
      <Ionicons
        name="person-outline"
        color={darkMode ? darkTheme.grayDark : lightTheme.grayDark}
        size={20}
      />
    </SmallNoAvatar>
  ) : size === "large" ? (
    <LargeNoAvatar>
      <Ionicons
        name="person-outline"
        color={darkMode ? darkTheme.grayDark : lightTheme.grayDark}
        size={60}
      />
    </LargeNoAvatar>
  ) : (
    <MediumNoAvatar>
      <Ionicons
        name="person-outline"
        color={darkMode ? darkTheme.grayDark : lightTheme.grayDark}
        size={30}
      />
    </MediumNoAvatar>
  );
};

export default function Avatar({ avatarUrl, size, focused }: IAvatarProps) {
  const darkMode = useReactiveVar(darkModeVar);

  return avatarUrl
    ? avatarSized(avatarUrl, size, focused, darkMode)
    : noAvatarSized(size, darkMode);
}
