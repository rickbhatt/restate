import { Card, FeatureCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useUserProfile } from "@/context/UserProfileContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
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

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const latestProperties = useQuery(api.properties.getLatestProperties);

  // Define the valid property types
  const validPropertyTypes = [
    "House",
    "Townhouse",
    "Apartment",
    "Condo",
    "Villa",
    "Duplex",
    "Studio",
    "Other",
    "All",
  ] as const;

  // Type guard to check if a string is a valid property type
  type PropertyType = (typeof validPropertyTypes)[number];
  const isValidPropertyType = (
    value: string | undefined
  ): value is PropertyType => {
    return (
      value !== undefined && validPropertyTypes.includes(value as PropertyType)
    );
  };

  // Use the filter if valid, otherwise default to "All"
  const filterValue = isValidPropertyType(params.filter)
    ? params.filter
    : "All";

  const properties = useQuery(api.properties.getProperties, {
    filter: filterValue,
    query: params.query!,
    limit: 10,
  });

  const handleCardPress = (id: string) => {
    router.push(`/(auth)/properties/${id}`);
  };

  return (
    <SafeAreaView className="bg-white h-full" edges={["bottom", "top"]}>
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item._id)} />
        )}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          properties === undefined ? (
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
              {latestProperties === undefined ? (
                <ActivityIndicator
                  size="large"
                  className="text-primary-300"
                  mt-5
                />
              ) : latestProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties}
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
            {/* Filters */}

            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default RootIndex;
