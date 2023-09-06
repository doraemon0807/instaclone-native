import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { IThemeProps } from "../styles";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

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

const SliderContainer = styled.View``;

export default function TakePhoto() {
  const [ok, setOk] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [zoom, setZoom] = useState(0);
  const [flashMode, setFlashMode] = useState(FlashMode.off);

  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setOk(granted);
  };

  const onCameraSwitch = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front);
    } else {
      setCameraType(CameraType.back);
    }
  };

  const onZoomValueChange = (value: number) => {
    setZoom(value);
  };

  const onFlashChange = () => {};

  useEffect(() => {
    getPermissions();
  }, [ok]);

  return (
    <Container>
      <Camera type={cameraType} style={{ flex: 1 }} zoom={zoom} />
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
          <TakePhotoBtn />
          <TouchableOpacity onPress={onCameraSwitch}>
            <Ionicons size={30} color="white" name="camera-reverse" />
          </TouchableOpacity>
        </ButtonsContainer>
      </Action>
    </Container>
  );
}
