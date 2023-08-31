import { ImageProps } from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../../styles";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../apollo";
import { Ionicons } from "@expo/vector-icons";

const SmallAvatar: React.FC<ImageProps> = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;
const MediumAvatar: React.FC<ImageProps> = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const LargeAvatar: React.FC<ImageProps> = styled.Image`
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
}

const avatarSized = (avatarUrl: string, size?: "small" | "large") => {
  return size === "small" ? (
    <SmallAvatar resizeMode="cover" source={{ uri: avatarUrl }} />
  ) : size === "large" ? (
    <LargeAvatar resizeMode="cover" source={{ uri: avatarUrl }} />
  ) : (
    <MediumAvatar resizeMode="cover" source={{ uri: avatarUrl }} />
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

export default function Avatar({ avatarUrl, size }: IAvatarProps) {
  const darkMode = useReactiveVar(darkModeVar);

  return avatarUrl
    ? avatarSized(avatarUrl, size)
    : noAvatarSized(size, darkMode);
}
