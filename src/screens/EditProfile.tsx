import React, { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { IThemeProps } from "../../styles";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { graphql } from "../gql";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditProfileMutation } from "../gql/graphql";
import Button from "../components/shared/Button";
import { ApolloClient, useApolloClient, useMutation } from "@apollo/client";
import { ME_QUERY } from "../hook/useUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigators/SharedStackNav";

type Props = NativeStackScreenProps<StackParamList, "EditProfile">;

interface IEditProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  errorMessage?: string;
}

interface INewData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const Container = styled.View`
  background-color: ${(props: IThemeProps) => props.theme.bgColor};
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Wrapper = styled.ScrollView`
  width: 100%;
  flex: 1;
  padding: 20px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  padding-bottom: 10px;
`;
const ErrorMessage = styled.Text`
  color: ${(props: IThemeProps) => props.theme.red};
  text-align: center;
`;

const EditHeader = styled.View`
  width: 100%;
  flex-direction: row;
`;

const EditMode = styled.TouchableOpacity<{ $active: boolean }>`
  justify-content: center;
  flex: 1;
  padding: 16px 0px;
  margin-bottom: 10px;
  border-bottom-width: 2px;
  border-color: ${(props: any) =>
    props.$active ? props.theme.fontColor : "transparent"};
`;

const EditModeText = styled.Text<{ $active: boolean }>`
  text-align: center;
  color: ${(props: any) =>
    props.$active ? props.theme.fontColor : props.theme.grayLight};
`;

const ProfileEditForm = styled.View`
  width: 100%;
  flex: 1;
`;
const PasswordEditForm = styled.View`
  width: 100%;
  flex: 1;
`;

const EDIT_PROFILE_MUTATION = graphql(`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $bio: String
    $oldPassword: String
    $newPassword: String
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      bio: $bio
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      ok
      error
    }
  }
`);

export default function EditProfile({ navigation, route: { params } }: Props) {
  // Edit Profile Mode State
  const [mode, setMode] = useState<"profile" | "password">("profile");

  // --- React Hook Form --- //
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm<IEditProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    let defaults = {
      firstName: params?.firstName,
      lastName: params?.lastName,
      username: params?.username,
      email: params?.email,
      bio: params?.bio,
    };
    reset(defaults);
  }, [params, reset]);

  useEffect(() => {
    register("firstName");
    register("lastName");
    register("username");
    register("email");
    register("bio");
    register("oldPassword");
    register("newPassword");
    register("confirmNewPassword");
  }, [register]);

  const lastNameRef: React.MutableRefObject<null> = useRef(null);
  const usernameRef: React.MutableRefObject<null> = useRef(null);
  const emailRef: React.MutableRefObject<null> = useRef(null);
  const bioRef: React.MutableRefObject<null> = useRef(null);
  const newPasswordRef: React.MutableRefObject<null> = useRef(null);
  const confirmNewPasswordRef: React.MutableRefObject<null> = useRef(null);

  //Jump to next input after input
  const onNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // --- MUTATION --- //
  const onCompleted = async ({
    editProfile: { ok, error },
  }: EditProfileMutation) => {
    if (ok) {
      navigation.pop(1);
    } else {
      setError("errorMessage", {
        message: error!,
      });
    }
  };

  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      refetchQueries: [ME_QUERY],
      onCompleted,
    }
  );

  const editProfileValidation = () => {
    let validation = true;
    let message = "";

    if (mode === "profile") {
      const { firstName, lastName, username, email, bio } = getValues();

      //check if all forms are complete
      if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !bio ||
        firstName === "" ||
        lastName === "" ||
        username === "" ||
        email === "" ||
        bio === ""
      ) {
        validation = false;
        message = "All fields must be filled in.";
      }
    }
    if (mode === "password") {
      const { oldPassword, newPassword, confirmNewPassword } = getValues();

      //check if all forms are complete
      if (
        !oldPassword ||
        !newPassword ||
        !confirmNewPassword ||
        oldPassword === "" ||
        newPassword === "" ||
        confirmNewPassword === ""
      ) {
        validation = false;
        message = "All fields must be filled in.";
      }

      //check if old password and new password is the same
      else if (oldPassword === newPassword) {
        validation = false;
        message = "Cannot use same password.";
      }

      //check if new passwords are same
      else if (newPassword !== confirmNewPassword) {
        validation = false;
        message = "Passwords must match.";
      }
    }

    return {
      validation,
      message,
    };
  };

  const onSubmitValid: SubmitHandler<IEditProfileForm> = (data) => {
    const { validation, message } = editProfileValidation();
    if (!validation) {
      return setError("errorMessage", {
        message,
      });
    }
    if (loading) {
      return;
    }

    let newData: INewData = { ...data };

    if (mode === "password") {
      newData.username = params?.username;
      delete newData.firstName;
      delete newData.lastName;
      delete newData.email;
      delete newData.bio;
    } else if (mode === "profile") {
      delete newData.oldPassword;
      delete newData.newPassword;
      delete newData.confirmNewPassword;
    }

    editProfileMutation({
      variables: {
        ...newData,
      },
    });
  };

  const clearAllError = () => {
    clearErrors();
  };

  return (
    <Container>
      <Wrapper>
        <EditHeader>
          <EditMode
            $active={mode === "profile"}
            onPress={() => setMode("profile")}
          >
            <EditModeText $active={mode === "profile"}>
              Change My Info
            </EditModeText>
          </EditMode>

          <EditMode
            $active={mode === "password"}
            onPress={() => setMode("password")}
          >
            <EditModeText $active={mode === "password"}>
              Change Password
            </EditModeText>
          </EditMode>
        </EditHeader>
        {mode === "profile" ? (
          <ProfileEditForm>
            <AuthInput
              blurOnSubmit={false}
              value={watch("firstName")}
              onSubmitEditing={() => onNext(lastNameRef)}
              returnKeyType="next"
              placeholder="First Name"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("firstName", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              value={watch("lastName")}
              onSubmitEditing={() => onNext(usernameRef)}
              innerRef={lastNameRef}
              returnKeyType="next"
              placeholder="Last Name"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("lastName", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              value={watch("username")}
              autoCapitalize="none"
              onSubmitEditing={() => onNext(emailRef)}
              innerRef={usernameRef}
              returnKeyType="next"
              placeholder="Username"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("username", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              value={watch("email")}
              autoCapitalize="none"
              onSubmitEditing={() => onNext(bioRef)}
              innerRef={emailRef}
              returnKeyType="next"
              keyboardType="email-address"
              placeholder="Email"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("email", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              multiline={true}
              value={watch("bio")}
              autoCapitalize="none"
              innerRef={bioRef}
              returnKeyType="done"
              keyboardType="email-address"
              placeholder="Bio"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("bio", text);
              }}
              lastOne={true}
              onSubmitEditing={handleSubmit(onSubmitValid)}
            />
          </ProfileEditForm>
        ) : null}
        {mode === "password" ? (
          <PasswordEditForm>
            <AuthInput
              blurOnSubmit={false}
              onSubmitEditing={() => onNext(newPasswordRef)}
              returnKeyType="next"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Current Password"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("oldPassword", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              onSubmitEditing={() => onNext(confirmNewPasswordRef)}
              innerRef={newPasswordRef}
              returnKeyType="next"
              autoCapitalize="none"
              secureTextEntry
              placeholder="New Password"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("newPassword", text);
              }}
            />
            <AuthInput
              blurOnSubmit={false}
              innerRef={confirmNewPasswordRef}
              returnKeyType="done"
              autoCapitalize="none"
              secureTextEntry
              placeholder="Confirm New Password"
              onChangeText={(text: string) => {
                clearAllError();
                setValue("confirmNewPassword", text);
              }}
              lastOne={true}
              onSubmitEditing={handleSubmit(onSubmitValid)}
            />
          </PasswordEditForm>
        ) : null}
        {errors.errorMessage?.message ? (
          <ErrorContainer>
            <ErrorMessage>{errors.errorMessage?.message}</ErrorMessage>
          </ErrorContainer>
        ) : null}

        <Button
          $accent
          loading={loading}
          text="Edit Profile"
          disabled={
            mode === "profile"
              ? getValues("firstName") === "" ||
                !getValues("firstName") ||
                getValues("lastName") === "" ||
                !getValues("lastName") ||
                getValues("username") === "" ||
                !getValues("username") ||
                getValues("email") === "" ||
                !getValues("email") ||
                getValues("bio") === "" ||
                !getValues("bio")
              : mode === "password"
              ? getValues("oldPassword") === "" ||
                !getValues("oldPassword") ||
                getValues("newPassword") === "" ||
                !getValues("newPassword") ||
                getValues("confirmNewPassword") === "" ||
                !getValues("confirmNewPassword")
              : true
          }
          onPress={handleSubmit(onSubmitValid)}
        />
      </Wrapper>
    </Container>
  );
}
