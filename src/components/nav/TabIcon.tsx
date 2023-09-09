import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface ITabIconProps {
  iconName: "home" | "search" | "camera" | "heart" | "person";
  focused: boolean;
  color: string;
  size?: number;
}

export default function TabIcon({
  iconName,
  focused,
  color,
  size,
}: ITabIconProps) {
  return (
    <Ionicons
      name={focused ? iconName : `${iconName}-outline`}
      color={color}
      size={size ? size : focused ? 28 : 22}
    />
  );
}
