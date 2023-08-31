import { RefObject, useEffect, useRef } from "react";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/shared/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { graphql } from "../gql";
import { useMutation } from "@apollo/client";
import { LoginMutation } from "../gql/graphql";
import { logUserIn } from "../apollo";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export interface ILoginForm {
  username: string;
  password: string;
}

const LOGIN_MUTATION = graphql(`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`);

export default function Login({ route: { params } }: Props) {
  // --- React Hook Form --- //
  const { register, handleSubmit, setValue, watch } = useForm<ILoginForm>({
    defaultValues: {
      username: params?.username,
      password: params?.password,
    },
  });

  //Register input values via useEffect. Only on React Native
  useEffect(() => {
    register("username");
    register("password");
  }, [register]);

  //Jump to Password after input
  const passwordRef: React.MutableRefObject<null> = useRef(null);

  const onNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  const onCompleted = async ({
    login: { ok, error, token },
  }: LoginMutation) => {
    if (ok && token) {
      await logUserIn(token);
    }
  };

  // --- MUTATION --- //
  // mutation function for login
  const [logInMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmitValid: SubmitHandler<ILoginForm> = ({ username, password }) => {
    if (!loading) {
      logInMutation({
        variables: {
          username,
          password,
        },
      });
    }
  };

  return (
    <AuthLayout>
      <AuthInput
        blurOnSubmit={false}
        value={watch("username")}
        autoCapitalize="none"
        returnKeyType="next"
        placeholder="Username"
        onSubmitEditing={() => onNext(passwordRef)}
        //set value of input value. Only on React Native
        onChangeText={(text: string) => setValue("username", text)}
      />
      <AuthInput
        value={watch("password")}
        innerRef={passwordRef}
        returnKeyType="done"
        secureTextEntry
        placeholder="Password"
        lastOne={true}
        onSubmitEditing={handleSubmit(onSubmitValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <Button
        loading={loading}
        text="Log in"
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onSubmitValid)}
      />
    </AuthLayout>
  );
}
