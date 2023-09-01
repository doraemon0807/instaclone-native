import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TextInputProps,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { IThemeProps, darkTheme, lightTheme } from "../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigators/SharedStackNav";
import DismissKeyboard from "../components/shared/DismissKeyboard";
import { SubmitHandler, useForm } from "react-hook-form";
import { graphql } from "../gql";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../apollo";
import PhotoRect from "../components/photo/PhotoRect";
import { QuerySearchPhotosArgs } from "../gql/graphql";

type Props = NativeStackScreenProps<StackParamList, "Search">;

interface TextInputPropsWithWidth extends TextInputProps {
  width: number;
}

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Input: React.FC<TextInputPropsWithWidth> = styled.TextInput.attrs(
  (props: IThemeProps) => ({
    placeholderTextColor: props.theme.grayNormal,
  })
)`
  background-color: ${(props: IThemeProps) => props.theme.borderColor};
  width: ${(props: TextInputPropsWithWidth) => props.width / 1.5}px;
  padding: 5px 10px;
  border-radius: 10px;
`;

const MessageContainer = styled.View``;
const MessageText = styled.Text`
  margin-top: 10px;
  color: ${(props: IThemeProps) => props.theme.fontColor};
  font-weight: 600;
`;

const SEARCH_PHOTOS = graphql(`
  query searchPhotos($keyword: String!, $offset: Int) {
    searchPhotos(keyword: $keyword, offset: $offset) {
      id
      file
    }
  }
`);

export default function Search({ navigation }: Props) {
  const darkMode = useReactiveVar(darkModeVar);

  const { width } = useWindowDimensions();

  const numColumns = 3;

  const { setValue, register, handleSubmit, getValues } =
    useForm<QuerySearchPhotosArgs>();

  // --- Lazy query: only run query when requested --- //
  const [startQueryFn, { loading, data, called, fetchMore, refetch }] =
    useLazyQuery(SEARCH_PHOTOS);

  const onSubmitEditing: SubmitHandler<QuerySearchPhotosArgs> = ({
    keyword,
  }) => {
    if (!loading) {
      startQueryFn({
        variables: {
          keyword,
          offset: 0,
        },
      });
    }
  };

  //search box in the header
  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="black"
      placeholder="Search Photos"
      autoCapitalize="none"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onSubmitEditing)}
    />
  );

  const renderItem = ({ item }: any) => {
    return (
      <PhotoRect navigation={navigation} numColumns={numColumns} {...item} />
    );
  };

  // refresh when pulled down
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword", {
      required: true,
      minLength: 3,
    });
  }, [navigation]);

  return (
    <DismissKeyboard>
      <Container>
        {/* When searching */}
        {loading ? (
          <MessageContainer>
            <ActivityIndicator
              size="large"
              color={darkMode ? darkTheme.fontColor : lightTheme.fontColor}
            />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {/* When data has not been called yet */}
        {!called ? (
          <MessageContainer>
            <MessageText>Search by keyword</MessageText>
          </MessageContainer>
        ) : null}
        {/* When search is performed */}
        {data?.searchPhotos !== undefined ? (
          // When there's no data from search query
          data?.searchPhotos?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            // When there's a data from search query

            <FlatList
              columnWrapperStyle={{
                justifyContent: "flex-start",
                width,
              }}
              data={data?.searchPhotos}
              renderItem={renderItem}
              keyExtractor={(photo) => photo?.id + ""}
              numColumns={numColumns}
              //Infinite scroll
              onEndReachedThreshold={0.3}
              onEndReached={() =>
                fetchMore({
                  variables: {
                    offset: data?.searchPhotos.length,
                    keyword: getValues("keyword"),
                  },
                })
              }
              //Refetch when scrolled down
              refreshing={refreshing}
              onRefresh={refresh}
            />
          )
        ) : null}
      </Container>
    </DismissKeyboard>
  );
}
