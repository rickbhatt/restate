import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PropertyDetails = () => {
  const { id } = useLocalSearchParams<{ id: Id<"properties"> }>();
  const property = useQuery(api.properties.getPropertyById, { id: id });
  const height = Dimensions.get("window").height;

  const { top, bottom } = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    // Animate background color
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 50],
      ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]
    );
    // Animate paddingBottom (from 0 to 12)
    const paddingBottom = interpolate(scrollY.value, [0, 50], [0, 12], "clamp");
    // Animate borderBottomWidth (from 0 to 1)
    const borderBottomWidth = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      "clamp"
    );
    // Animate borderBottomColor (from transparent to rgba(0,0,0,0.1))
    const borderBottomColor = interpolateColor(
      scrollY.value,
      [0, 50],
      ["rgba(0,0,0,0)", "rgba(0,0,0,0.1)"]
    );

    return {
      backgroundColor,
      paddingBottom,
      borderBottomWidth,
      borderBottomColor,
      width: "100%",
    };
  });

  const router = useRouter();

  return (
    <View style={{ paddingBottom: bottom }}>
      <Stack.Screen
        options={{
          header: () => (
            <Animated.View
              className="flex flex-row items-center z-50 absolute px-7"
              style={[
                {
                  paddingTop: top,
                },
                headerAnimatedStyle,
              ]}
            >
              <Pressable
                onPress={() => router.back()}
                className="flex flex-row bg-white rounded-full size-11 items-center justify-center active:opacity-50"
              >
                <Ionicons name="arrow-back" size={20} color="black" />
              </Pressable>
            </Animated.View>
          ),
        }}
      />
      <Animated.ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="relative w-full" style={{ height: height / 2 }}>
          <Image
            className="size-full"
            source={{ uri: property?.imageUrl }}
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />
        </View>
        <View className="px-5 mt-7 flex gap-2">
          {/* property name */}
          <View className="flex flex-row items-center justify-between">
            <Text className="text-2xl text-black font-rubik-extrabold">
              {property?.name}
            </Text>
            <View className="flex flex-row items-center gap-5">
              <Image
                source={icons.heart}
                className="size-7"
                tintColor={"#191D31"}
              />
              <Image source={icons.send} className="size-7" />
            </View>
          </View>
          {/* property type, rating */}
          <View className="flex flex-row items-center gap-3">
            {/* property type */}
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>
            {/* rating */}
            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} />
              <Text>
                {property?.rating} ({property?.reviews?.length} reviews)
              </Text>
            </View>
          </View>

          {/* facilities */}
          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bathroom} Baths
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.area} sqft
            </Text>
          </View>

          {/* agent */}
          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Agent
            </Text>

            {/* agen details and icons*/}
            <View className="flex flex-row items-center justify-between mt-4">
              {/* agent details */}
              <View className="flex flex-row items-center gap-4">
                <Image
                  className="size-14 rounded-full"
                  source={{ uri: property?.agent?.imageUrl }}
                />
                <View className="flex flex-col items-start justify-center">
                  <Text className="text-lg text-black-300 font-rubik-bold text-start">
                    {property?.agent?.name}
                  </Text>
                  <Text className="text-sm text-black-200 font-rubik-medium">
                    {property?.agent?.email}
                  </Text>
                </View>
              </View>
              {/* icons */}
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          {/* property description */}
          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.description}
            </Text>
          </View>

          {/* property facilities */}
          <View className="mt-7 flex flex-col">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Facilities
            </Text>

            {property?.facilities && property?.facilities?.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.title === item
                  );

                  return (
                    <View
                      key={index}
                      className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                    >
                      <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className="size-6"
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-black-300 text-sm text-center font-rubik mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* property gallery */}
            {property?.gallery && property?.gallery.length > 0 && (
              <View className="mt-7 flex flex-col">
                <Text className="text-black-300 text-xl font-rubik-bold">
                  Gallery
                </Text>
                <FlatList
                  data={property?.gallery}
                  keyExtractor={(item) => item._id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="size-40 rounded-xl"
                    />
                  )}
                  contentContainerClassName="flex gap-4 mt-3"
                />
              </View>
            )}

            {/* property location */}
            <View className="mt-7 flex flex-col">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Location
              </Text>

              <View className="flex flex-row items-center justify-start mt-4 gap-4">
                <Image source={icons.location} />
                <Text>{property?.address}</Text>
              </View>
              <Image
                source={images.map}
                className="h-52 w-full mt-5 rounded-xl"
              />
            </View>

            {/* property reviews */}
            {property?.reviews && property?.reviews.length > 0 && (
              <View className="mt-7 flex flex-col">
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <Image source={icons.star} className="size-6" />
                    <Text className="text-black-300 text-xl font-rubik-bold">
                      {property?.rating} ({property?.reviews?.length} reviews)
                    </Text>
                  </View>
                  <Pressable>
                    <Text className="text-primary-300 text-base font-rubik-bold">
                      See All
                    </Text>
                  </Pressable>
                </View>
                {/* comment */}
                <View className="mt-5">
                  <Comment review={property?.reviews[0]} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>
      <View
        style={{
          paddingBottom: bottom + 10,
        }}
        className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7"
      >
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-base font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ₹{property?.price}
            </Text>
          </View>
          <Pressable className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-lg shadow-zinc-400 active:opacity-70">
            <Text className="text-white text-lg text-center font-rubik-bold">
              Book Now
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PropertyDetails;
