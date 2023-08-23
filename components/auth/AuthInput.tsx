import styled from "styled-components/native";

const STextInput = styled.TextInput.attrs({
  placeholderTextColor: "gray",
})`
  background-color: white;
  width: 100%;
`;

export default function AuthInput({ ...props }) {
  return <STextInput {...props} />;
}
