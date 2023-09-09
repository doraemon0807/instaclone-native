import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageProps,
  TextInputProps,
} from "react-native";
import { UploadNavTabParamList } from "../navigators/UploadNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import DismissKeyboard from "../components/shared/DismissKeyboard";
import { SubmitHandler, useForm } from "react-hook-form";
import HeaderButton from "../components/header/HeaderButton";
import { ApolloCache, useMutation } from "@apollo/client";
import { graphql } from "../gql";
import { ReactNativeFile } from "apollo-upload-client";
import { Photo, UploadPhotoMutation } from "../gql/graphql";

type Props = NativeStackScreenProps<UploadNavTabParamList, "UploadForm">;

const Container = styled.View`
  flex: 1;
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  padding: 0px 50px;
`;
const PhotoImage: React.FC<ImageProps> = styled.Image`
  flex: 1;
`;
const CaptionContainer = styled.View`
  flex: 1;
  margin-top: 20px;
`;
const Caption: React.FC<TextInputProps> = styled.TextInput.attrs(
  (props: IThemeProps) => ({
    placeholderTextColor: props.theme.grayNormal,
  })
)`
  background-color: white;
  padding: 10px 20px;
  border-radius: 100px;
  color: black;
`;

interface IUploadForm {
  caption: string;
}

interface IUpdateUploadPhotoProps {
  data?: UploadPhotoMutation | null;
}

const UPLOAD_PHOTO_MUTATION = graphql(`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ok
      error
      photo {
        ...PhotoFragment
        user {
          ...UserFragment
        }
      }
    }
  }
`);

export default function UploadForm({ route, navigation }: Props) {
  // --- mutation --- //

  // Modify cache: add new photo to the feed
  const updateUploadPhoto = (
    cache: ApolloCache<Photo>,
    result: IUpdateUploadPhotoProps
  ) => {
    if (!result.data) {
      return;
    }
    const {
      data: { uploadPhoto },
    } = result;
    if (uploadPhoto.ok) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev];
          },
        },
      });
    }
  };

  // mutation function
  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updateUploadPhoto,
    }
  );

  // useForm for caption
  const { register, handleSubmit, setValue } = useForm<IUploadForm>();

  useEffect(() => {
    register("caption");
  }, [register]);

  const onSubmitValid: SubmitHandler<IUploadForm> = async ({ caption }) => {
    if (route.params?.file) {
      const file = new ReactNativeFile({
        uri: route.params.file,
        name: `1.jpg`,
        type: "image/jpeg",
      });
      await uploadPhotoMutation({
        variables: {
          caption,
          file,
        },
      });
      navigation.navigate("Tabs");
    } else {
      Alert.alert("An error occurred. Please try again.", "", [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate("SelectPhoto");
          },
        },
      ]);
    }
  };

  // navigation bar buttons config for loading
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? headerLoading : headerRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const headerRight = () => (
    <HeaderButton
      buttonName="Next"
      buttonFunction={handleSubmit(onSubmitValid)}
    />
  );

  const headerLoading = () => (
    <ActivityIndicator style={{ marginRight: 10 }} size="small" color="white" />
  );
  return (
    <DismissKeyboard>
      <Container>
        <PhotoImage
          resizeMode="contain"
          source={{ uri: route?.params?.file }}
        />
        <CaptionContainer>
          <Caption
            returnKeyType="done"
            placeholder="Write a caption..."
            onChangeText={(text) => setValue("caption", text)}
            onSubmitEditing={handleSubmit(onSubmitValid)}
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
}
