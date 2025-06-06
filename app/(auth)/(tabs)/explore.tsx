import { ExploreCard } from "@/components/Cards";
import {
  OtherPropertyFilters,
  PropertyTypeFilters,
} from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { api } from "@/convex/_generated/api";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Explore = () => {
  const router = useRouter();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const bottomSheetRef = useRef<BottomSheet>(null);

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
    limit: 20,
  });

  const handleCardPress = (id: string) => {
    router.push(`/(auth)/properties/${id}`);
  };

  const handleFilterPress = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-white flex-1" edges={["bottom", "top"]}>
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <ExploreCard
              item={item}
              onPress={() => handleCardPress(item._id)}
            />
          )}
          keyExtractor={(item) => item._id.toString()}
          contentContainerClassName="pb-32 px-5"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            properties === undefined ? (
              <ActivityIndicator
                size="large"
                className="text-primary-300"
                mt-5
              />
            ) : (
              <NoResults />
            )
          }
          ListHeaderComponent={
            <View>
              <View className="flex flex-row items-center justify-between mt-5">
                <Pressable
                  className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center active:opacity-50"
                  onPress={() => router.back()}
                >
                  <Image source={icons.backArrow} className="size-5" />
                </Pressable>
                <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                  Search for your ideal home
                </Text>
                <Image source={icons.bell} className="w-6 h-6" />
              </View>
              <Search filterOnPress={handleFilterPress} />
              <View className="mt-5">
                <PropertyTypeFilters />
                <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                  Found {properties?.length}{" "}
                  {properties !== undefined && properties?.length > 1
                    ? "properties"
                    : "property"}
                </Text>
              </View>
            </View>
          }
        />
        <OtherPropertyFilters bottomSheetRef={bottomSheetRef} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Explore;
