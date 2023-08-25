import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/Button";
import AuthInput from "../components/auth/AuthInput";
import { RefObject, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const { register, handleSubmit, setValue } = useForm<IFormValues>();

  const onValid: SubmitHandler<IFormValues> = (data) => {
    console.log(data);
  };

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

  return (
    <AuthLayout>
      <AuthInput
        onSubmitEditing={() => onNext(lastNameRef)}
        returnKeyType="next"
        placeholder="First Name"
        onChangeText={(text: string) => setValue("firstName", text)}
      />
      <AuthInput
        onSubmitEditing={() => onNext(usernameRef)}
        innerRef={lastNameRef}
        returnKeyType="next"
        placeholder="Last Name"
        onChangeText={(text: string) => setValue("lastName", text)}
      />
      <AuthInput
        autoCapitalize="none"
        onSubmitEditing={() => onNext(emailRef)}
        innerRef={usernameRef}
        returnKeyType="next"
        placeholder="Username"
        onChangeText={(text: string) => setValue("username", text)}
      />
      <AuthInput
        autoCapitalize="none"
        onSubmitEditing={() => onNext(passwordRef)}
        innerRef={emailRef}
        returnKeyType="next"
        keyboardType="email-address"
        placeholder="Email"
        onChangeText={(text: string) => setValue("email", text)}
      />
      <AuthInput
        onSubmitEditing={handleSubmit(onValid)}
        innerRef={passwordRef}
        returnKeyType="done"
        secureTextEntry
        placeholder="Password"
        onChangeText={(text: string) => setValue("password", text)}
        lastOne={true}
      />
      <Button
        text="Create Account"
        disabled={false}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
