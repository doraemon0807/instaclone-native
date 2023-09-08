import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { IThemeProps, lightTheme } from "../styles";
import * as MediaLibrary from "expo-media-library";
import { Alert, FlatList, Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UploadNavStackParamList } from "../navigators/UploadNav";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<UploadNavStackParamList, "Select">;

const Container = styled.View`
  flex: 1;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
`;
const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;

const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 5px;
`;

const HeaderRightText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.accentNormal};
  font-size: 18px;
  font-weight: 500;
  margin-right: 8px;
`;

export default function SelectPhoto({ navigation }: Props) {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [lastId, setLastId] = useState("");
  const [chosenPhoto, setChosenPhoto] = useState("");
  const { width } = useWindowDimensions();
  const numColumns = 4;

  //Access photos from device's storage
  const getPhotos = async (lastId?: string) => {
    const { assets, endCursor, hasNextPage } =
      await MediaLibrary.getAssetsAsync({
        after: lastId,
      });
    setPhotos((prev) =>
      lastId === undefined ? [...assets] : [...prev, ...assets]
    );
    if (hasNextPage) {
      setLastId(endCursor);
    }
  };

  //Access device's media
  const getPermissions = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === "granted") {
      setOk(true);
      getPhotos();
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setOk(true);
        getPhotos();
      }
    }
  };

  const goToUpload = () => {
    if (chosenPhoto !== "") {
      navigation.navigate("UploadForm", {
        file: chosenPhoto,
      });
    } else {
      Alert.alert("You must choose a photo before proceeding.");
      return;
    }
  };

  useEffect(() => {
    getPermissions();
  }, [ok]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={goToUpload}>
          <HeaderRightText>Next</HeaderRightText>
        </TouchableOpacity>
      ),
    });
  }, [chosenPhoto]);

  //function to choose photo
  const choosePhoto = (uri: string) => {
    setChosenPhoto(uri);
  };

  //renderitem for flatlist
  const renderItem = ({ item: photo }: any) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / numColumns, height: width / numColumns }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={
            photo.uri === chosenPhoto
              ? lightTheme.accentLight
              : lightTheme.grayNormal
          }
        />
      </IconContainer>
    </ImageContainer>
  );

  return (
    <Container>
      <Top>
        {chosenPhoto !== "" && (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width, height: "100%" }}
          />
        )}
      </Top>
      <Bottom>
        <FlatList
          onEndReachedThreshold={0.02}
          onEndReached={() => getPhotos(lastId)}
          data={photos}
          keyExtractor={(photo) => photo.id}
          renderItem={renderItem}
          numColumns={4}
        />
      </Bottom>
    </Container>
  );
}
