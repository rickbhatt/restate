import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PublicLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sso-callback" />
    </Stack>
  );
};

export default PublicLayout;
