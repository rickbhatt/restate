import icons from "@/constants/icons";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const router = useRouter();

  const handleLogin = () => {
    console.log("login");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="flex-1">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to ReState
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}{" "}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          <Pressable
            onPress={handleLogin}
            className="bg-white border shadow-md shadow-zinc-300 rounded-full w-full h-16 py-4 mt-12 active:opacity-50 active:bg-gray-100"
          >
            <View className="flex h-full flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-7 h-7"
                resizeMode="contain"
              />
              <Text className="text-xl font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
