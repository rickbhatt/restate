import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const RootIndex = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Text className="font-bold text-lg my-10">Welcome Restate</Text>
      <Pressable
        onPress={() => {
          console.log("signedout");
          signOut();
        }}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default RootIndex;
