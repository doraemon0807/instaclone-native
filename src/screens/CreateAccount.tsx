import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/shared/Button";
import AuthInput from "../components/auth/AuthInput";
import { RefObject, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { graphql } from "../gql";
import { useMutation } from "@apollo/client";
import { CreateAccountMutation } from "../gql/graphql";
import { LoggedOutNavStackParamList } from "../navigators/LoggedOutNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  LoggedOutNavStackParamList,
  "CreateAccount"
>;

interface ICreateAccountForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const CREATE_ACCOUNT_MUTATION = graphql(`
  mutation createAccount(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`);

export default function CreateAccount({ navigation }: Props) {
  // --- React Hook Form --- //
  const { register, handleSubmit, setValue, getValues } =
    useForm<ICreateAccountForm>();

  useEffect(() => {
    register("firstName", {
      required: true,
    });
    register("lastName", {
      required: true,
    });
    register("username", {
      required: true,
    });
    register("email", {
      required: true,
    });
    register("password", {
      required: true,
    });
  }, [register]);

  const lastNameRef: React.MutableRefObject<null> = useRef(null);
  const usernameRef: React.MutableRefObject<null> = useRef(null);
  const emailRef: React.MutableRefObject<null> = useRef(null);
  const passwordRef: React.MutableRefObject<null> = useRef(null);

  //Jump to next input after input
  const onNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // --- MUTATION --- //
  const onCompleted = ({ createAccount: { ok } }: CreateAccountMutation) => {
    const { username, password } = getValues();
    if (ok) {
      navigation.navigate("Login", {
        username: username,
        password: password,
      });
    }
  };

  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmitValid: SubmitHandler<ICreateAccountForm> = (data) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  return (
    <AuthLayout>
      <AuthInput
        blurOnSubmit={false}
        onSubmitEditing={() => onNext(lastNameRef)}
        returnKeyType="next"
        placeholder="First Name"
        onChangeText={(text: string) => setValue("firstName", text)}
      />
      <AuthInput
        blurOnSubmit={false}
        onSubmitEditing={() => onNext(usernameRef)}
        innerRef={lastNameRef}
        returnKeyType="next"
        placeholder="Last Name"
        onChangeText={(text: string) => setValue("lastName", text)}
      />
      <AuthInput
        blurOnSubmit={false}
        autoCapitalize="none"
        onSubmitEditing={() => onNext(emailRef)}
        innerRef={usernameRef}
        returnKeyType="next"
        placeholder="Username"
        onChangeText={(text: string) => setValue("username", text)}
      />
      <AuthInput
        blurOnSubmit={false}
        autoCapitalize="none"
        onSubmitEditing={() => onNext(passwordRef)}
        innerRef={emailRef}
        returnKeyType="next"
        keyboardType="email-address"
        placeholder="Email"
        onChangeText={(text: string) => setValue("email", text)}
      />
      <AuthInput
        onSubmitEditing={handleSubmit(onSubmitValid)}
        innerRef={passwordRef}
        returnKeyType="done"
        secureTextEntry
        placeholder="Password"
        onChangeText={(text: string) => setValue("password", text)}
        lastOne={true}
      />
      <Button
        $accent
        loading={loading}
        text="Create Account"
        disabled={false}
        onPress={handleSubmit(onSubmitValid)}
      />
    </AuthLayout>
  );
}
