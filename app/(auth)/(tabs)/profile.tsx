import SettingsItem from "@/components/SettingsItem";
import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useUserProfile } from "@/context/UserProfileContext";
import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { signOut } = useAuth();

  const { userProfile } = useUserProfile();

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex justify-center flex-row mt-5">
          <View className="flex flex-col items-center mt-5">
            <View className="relative">
              <Image
                source={
                  userProfile?.imageUrl
                    ? { uri: userProfile?.imageUrl }
                    : images.avatar
                }
                className="size-44 rounded-full relative"
              />
              <Pressable className="absolute bottom-0 right-0">
                <Image source={icons.edit} className="size-9" />
              </Pressable>
            </View>
            <Text className="text-2xl font-rubik-bold mt-2">
              {userProfile?.fullName}
            </Text>
          </View>
        </View>
        <View className="flex flex-col mt-10">
          {settings.slice(0, 2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>
        <View className="flex flex-col mt-5 border-t border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View>
        <View className="flex flex-col mt-5 border-t border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={signOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
