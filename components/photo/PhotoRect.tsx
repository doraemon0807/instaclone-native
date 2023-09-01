import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  ImageProps,
  TouchableOpacityProps,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { StackParamList } from "../../navigators/SharedStackNav";

interface ImagePropsWithWidth extends ImageProps {
  width: number;
  numColumns: number;
}

const PhotoContainer: React.FC<TouchableOpacityProps> = styled.TouchableOpacity`
  background-color: "green";
`;

const File: React.FC<ImagePropsWithWidth> = styled.Image`
  width: ${(props: ImagePropsWithWidth) => props.width / props.numColumns}px;
  aspect-ratio: 1;
`;

interface IPhotoRectProps {
  id: number;
  file: string;
  navigation: NativeStackNavigationProp<StackParamList, "Search", undefined>;
  numColumns: number;
}

export default function PhotoRect({
  id,
  file,
  navigation,
  numColumns,
}: IPhotoRectProps) {
  const { width } = useWindowDimensions();
  return (
    <PhotoContainer
      onPress={() =>
        navigation.navigate("Photo", {
          photoId: id,
        })
      }
    >
      <File
        source={{ uri: file }}
        resizeMode="contain"
        width={width}
        numColumns={numColumns}
      />
    </PhotoContainer>
  );
}
