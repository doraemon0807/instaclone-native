import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UploadNavTabParamList } from "../navigators/UploadNav";
import * as MediaLibrary from "expo-media-library";
import { Alert, View } from "react-native";

type Props = NativeStackScreenProps<UploadNavTabParamList, "TakePhoto">;

const Container = styled.View`
  flex: 1;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
`;

const Action = styled.View`
  flex: 0.3;
  padding: 0px 50px;
  align-items: center;
  justify-content: space-around;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: ${(props: IThemeProps) => props.theme.fontColor};
  border-radius: 50px;
  border: 4px solid ${(props: IThemeProps) => props.theme.grayNormal};
`;

const FlashBtn = styled.TouchableOpacity``;

const OrientationBtn = styled.TouchableOpacity``;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  left: 10px;
`;

const SliderContainer = styled.View``;
const ActionsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
`;

const TakenPhoto = styled.Image`
  flex: 1;
`;

const PhotoActionContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const PhotoAction = styled.TouchableOpacity`
  background-color: ${(props: IThemeProps) => props.theme.fontColor};
  padding: 5px 10px;
  border-radius: 4px;
`;

const PhotoActionText = styled.Text`
  font-weight: 600;
`;

export default function TakePhoto({ navigation }: Props) {
  const [ok, setOk] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [cameraReady, setCameraReady] = useState(false);
  const [takenPhoto, setTakenPhoto] = useState("");
  const isFocused = useIsFocused();
  const cameraRef = useRef<Camera | null>();

  //function to request permission to use camera
  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setOk(granted);
  };

  //function to switch camera orientation
  const onCameraSwitch = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front);
    } else {
      setCameraType(CameraType.back);
    }
  };

  //function to scale zoom value
  const onZoomValueChange = (value: number) => {
    setZoom(value);
  };

  //function to toggle flash
  const onFlashChange = () => {
    if (flashMode === FlashMode.off) {
      //on
      setFlashMode(FlashMode.on);
    } else if (flashMode === FlashMode.on) {
      //auto
      setFlashMode(FlashMode.auto);
    } else if (flashMode === FlashMode.auto) {
      //off
      setFlashMode(FlashMode.off);
    }
  };

  const onCameraReady = () => setCameraReady(true);

  //function to take photo
  const takePhoto = async () => {
    if (cameraRef.current && cameraReady) {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });

      setTakenPhoto(uri);
    }
  };

  const onRetake = () => setTakenPhoto("");

  // If save is true, photo will be saved before moving to Upload
  const goToUpload = async (save: boolean) => {
    if (save) {
      //save photo to internal storage
      await MediaLibrary.saveToLibraryAsync(takenPhoto);
    }
    //go to upload screen
    navigation.navigate("UploadForm", {
      file: takenPhoto,
    });
  };

  // Alert message when tapped on Upload button
  const onUpload = () => {
    Alert.alert(
      "Save Photo?",
      "Do you want to save your photo before uploading?",
      [
        {
          text: "Save & Upload",
          onPress: () => {
            goToUpload(true);
          },
        },
        {
          text: "Just Upload",
          onPress: () => {
            goToUpload(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    getPermissions();
  }, [ok]);

  return (
    isFocused && (
      <Container>
        {takenPhoto === "" ? (
          <Camera
            type={cameraType}
            style={{ flex: 1 }}
            zoom={zoom}
            flashMode={flashMode}
            ref={(camera) => {
              cameraRef.current = camera;
            }}
            onCameraReady={onCameraReady}
          >
            <CloseBtn onPress={() => navigation.navigate("Tabs")}>
              <Ionicons size={30} color="white" name="close" />
            </CloseBtn>
          </Camera>
        ) : (
          <TakenPhoto source={{ uri: takenPhoto }} />
        )}
        {takenPhoto === "" ? (
          <Action>
            <SliderContainer>
              <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#FFFFFF"
                onValueChange={onZoomValueChange}
              />
            </SliderContainer>
            <ButtonsContainer>
              <ActionsContainer>
                <FlashBtn onPress={onFlashChange}>
                  <Ionicons
                    size={30}
                    color="white"
                    name={
                      flashMode === FlashMode.off
                        ? "flash-off"
                        : flashMode === FlashMode.auto
                        ? "eye"
                        : flashMode === FlashMode.on
                        ? "flash"
                        : "flash"
                    }
                  />
                </FlashBtn>
                <TakePhotoBtn onPress={takePhoto} />
                <OrientationBtn onPress={onCameraSwitch}>
                  <Ionicons size={30} color="white" name="camera-reverse" />
                </OrientationBtn>
              </ActionsContainer>
            </ButtonsContainer>
          </Action>
        ) : (
          <Action>
            <PhotoActionContainer>
              <PhotoAction onPress={onRetake}>
                <PhotoActionText>Retake</PhotoActionText>
              </PhotoAction>
              <PhotoAction onPress={onUpload}>
                <PhotoActionText>Upload</PhotoActionText>
              </PhotoAction>
            </PhotoActionContainer>
          </Action>
        )}
      </Container>
    )
  );
}
