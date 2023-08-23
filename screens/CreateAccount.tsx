import styled from "styled-components/native";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/Button";
import AuthInput from "../components/auth/AuthInput";

export default function CreateAccount() {
  return (
    <AuthLayout>
      <AuthInput returnKeyType="next" placeholder="First Name" />
      <AuthInput returnKeyType="next" placeholder="Last Name" />
      <AuthInput returnKeyType="next" placeholder="Username" />
      <AuthInput
        returnKeyType="next"
        keyboardType="email-address"
        placeholder="Email"
      />
      <AuthInput returnKeyType="done" secureTextEntry placeholder="Password" />
      <Button text="Create Account" disabled={true} onPress={() => null} />
    </AuthLayout>
  );
}
