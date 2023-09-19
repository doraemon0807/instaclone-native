import styled from "styled-components/native";
import { IPostModeParams } from "../../screens/Profile";
import { Ionicons } from "@expo/vector-icons";
import { IThemeProps } from "../../../styles";

const PhotoGrid = styled.View`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;

const PhotoContainer = styled.View<{ $bg?: string }>`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${(props: { $bg?: string }) => props.$bg});
  background-size: cover;
  position: relative;
`;

const PhotoIcons = styled.View`
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
  transition: all 0.1s ease-in-out;
`;

const PhotoIcon = styled.View`
  transition: all 0.1s ease-in-out;
  color: ${(props: IThemeProps) => props.theme.grayLight};
  opacity: 0;
`;

const PhotoIconText = styled.Text`
  margin-left: 5px;
`;

const PhotoEmptyBox = styled.View`
  justify-content: center;
  align-items: center;
`;

const PhotoEmptyBoxText = styled.Text`
  color: ${(props: IThemeProps) => props.theme.fontColor};
`;

interface IPhotoGalleryProps {
  mode: IPostModeParams;
  isMe: boolean;
  photos: ({
    __typename?: "Photo" | undefined;
    id: number;
    file: string;
    likes: number;
    commentCount: number;
    isLiked: boolean;
    caption?: string | null | undefined;
    createdAt: string;
    isMine: boolean;
  } | null)[];
}

function PhotoGallery({ mode, isMe, photos }: IPhotoGalleryProps) {
  return (
    <PhotoGrid>
      {/* {photos.length > 0 ? (
        photos.map((photo) => (
          <PhotoContainer key={photo?.id} $bg={photo?.file}>
            <PhotoIcons>
              <PhotoIcon>
                <Ionicons name="heart" />
                <PhotoIconText>{photo?.likes}</PhotoIconText>
              </PhotoIcon>
              <PhotoIcon>
                <Ionicons name="chatbubble" />
                <PhotoIconText>{photo?.commentCount}</PhotoIconText>
              </PhotoIcon>
            </PhotoIcons>
          </PhotoContainer>
        ))
      ) : mode === "posts" ? (
        isMe ? (
          <PhotoEmptyBox>
            <PhotoEmptyBoxText>Post + Me</PhotoEmptyBoxText>
          </PhotoEmptyBox>
        ) : (
          <PhotoEmptyBox>
            <PhotoEmptyBoxText>Post + not me</PhotoEmptyBoxText>
          </PhotoEmptyBox>
        )
      ) : mode === "saved" ? (
        <PhotoEmptyBox>
          <PhotoEmptyBoxText>Saved + me</PhotoEmptyBoxText>
        </PhotoEmptyBox>
      ) : mode === "tagged" ? (
        isMe ? (
          <PhotoEmptyBox>
            <PhotoEmptyBoxText>Tagged + Me</PhotoEmptyBoxText>
          </PhotoEmptyBox>
        ) : (
          <PhotoEmptyBox>
            <PhotoEmptyBoxText>Tagged + not me</PhotoEmptyBoxText>
          </PhotoEmptyBox>
        )
      ) : null} */}
    </PhotoGrid>
  );
}

export default PhotoGallery;
