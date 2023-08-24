import { RefObject, useEffect, useRef } from "react";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/Button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

interface IFormValues {
  username: string;
  password: string;
}

export default function Login({ navigation }: Props) {
  //React Hook Form
  const { register, handleSubmit, setValue } = useForm<IFormValues>();

  const onValid: SubmitHandler<IFormValues> = (data) => {
    console.log(data);
  };

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

  return (
    <AuthLayout>
      <AuthInput
        autoCapitalize="none"
        returnKeyType="next"
        placeholder="Username"
        onSubmitEditing={() => onNext(passwordRef)}
        //set value of input value. Only on React Native
        onChangeText={(text: string) => setValue("username", text)}
      />
      <AuthInput
        innerRef={passwordRef}
        returnKeyType="done"
        secureTextEntry
        placeholder="Password"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <Button text="Log in" disabled={false} onPress={handleSubmit(onValid)} />
    </AuthLayout>
  );
}
