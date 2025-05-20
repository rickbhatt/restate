import { Card, FeatureCard } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useUserProfile } from "@/context/UserProfileContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RootIndex = () => {
  const { userProfile } = useUserProfile();

  const router = useRouter();

  const propertiesForHome = useQuery(api.properties.getPropertiesForHome);

  const { featuredProperties = [], recommendedProperties = [] } =
    propertiesForHome ?? {};

  const handleCardPress = (id: string) => {
    router.push(`/(auth)/properties/${id}`);
  };

  return (
    <SafeAreaView className="bg-white h-full" edges={["bottom", "top"]}>
      <FlatList
        data={recommendedProperties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          propertiesForHome === undefined ? (
            <ActivityIndicator size="large" className="text-primary-300" mt-5 />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={
                    userProfile?.imageUrl
                      ? { uri: userProfile?.imageUrl }
                      : images.userImagePlacholder
                  }
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Good Morning
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {userProfile?.fullName}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Pressable
              pointerEvents="box-only"
              onPress={() => router.push("/(auth)/(tabs)/explore")}
            >
              <Search />
            </Pressable>
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
              {propertiesForHome === undefined ? (
                <ActivityIndicator
                  size="large"
                  className="text-primary-300"
                  mt-5
                />
              ) : featuredProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={featuredProperties}
                  renderItem={({ item }) => (
                    <FeatureCard
                      item={item}
                      onPress={() => handleCardPress(item._id)}
                    />
                  )}
                  keyExtractor={(item) => item._id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
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
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default RootIndex;
