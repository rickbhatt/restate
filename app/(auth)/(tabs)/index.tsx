import { Card, FeatureCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RootIndex = () => {
  const { user } = useUser();

  const data = useQuery(api.users.getAllUsers);
  console.log("🚀 ~ RootIndex ~ data:", data);

  return (
    <SafeAreaView className="bg-white h-full" edges={["bottom", "top"]}>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        renderItem={({ item }) => <Card />}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.imageUrl || images.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.fullName}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            {/* Featured */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <Pressable>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </Pressable>
              </View>
              <FlatList
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={({ item }) => <FeatureCard />}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>
            {/* Recomendation */}
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Our Recomendation
              </Text>
              <Pressable>
                <Text className="text-base font-rubik-bold text-primary-300">
                  See All
                </Text>
              </Pressable>
            </View>
            {/* Filters */}

            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default RootIndex;
