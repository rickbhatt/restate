import { categories } from "@/constants/data";
import icons from "@/constants/icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OtherPropertyFiltersProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

export const PropertyTypeFilters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();

  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  const router = useRouter();

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("All");
      router.setParams({ filter: "All" });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => (
        <Pressable
          onPress={() => handleCategoryPress(item.category)}
          key={index}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full active:opacity-40 ${
            selectedCategory === item.category
              ? "bg-primary-300"
              : "bg-primary-100 border border-primary-200"
          } `}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.category
                ? "text-white font-rubik-bold mt-0.5"
                : "text-primary-300 font-rubik"
            }`}
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export const OtherPropertyFilters = ({
  bottomSheetRef,
}: OtherPropertyFiltersProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [areaRange, setAreaRange] = useState<number[]>([0, 10000]);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);

  const { bottom } = useSafeAreaInsets();

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleSheetChange = useCallback((index: any) => {
    console.log("Current snap point index:", index);
    console.log("Current snap point value:", snapPoints[index]);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const snapPoints = useMemo(() => ["45%", "75%"], []);

  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  const handleAreaRange = (values: number[]) => {
    setAreaRange(values);
  };

  const handleBedRoomCounter = (type: string) => {
    if (type === "plus") {
      if (bedrooms >= 5) return;
      setBedrooms((curr) => curr + 1);
    } else if (type === "minus") {
      if (bedrooms <= 1) return;
      setBedrooms((curr) => curr - 1);
    }
  };
  const handlerBathroomCounter = (type: string) => {
    if (type === "plus") {
      if (bathrooms >= 5) return;
      setBathrooms((curr) => curr + 1);
    } else if (type === "minus") {
      if (bathrooms <= 1) return;
      setBathrooms((curr) => curr - 1);
    }
  };

  const handlerReset = () => {
    setPriceRange([0, 10000]);
    setBedrooms(1);
    setBathrooms(1);
    setAreaRange([0, 10000]);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      backgroundStyle={{
        backgroundColor: "#fff",
        borderRadius: 32,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#000",
      }}
    >
      {/* Main container with proper structure */}
      <BottomSheetView className="flex-1 px-7">
        {/* Fixed Header - NOT inside ScrollView */}
        <BottomSheetView className="flex flex-row items-center justify-between py-4">
          <Pressable
            className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center active:opacity-50"
            onPress={handleBottomSheetClose}
          >
            <Image source={icons.backArrow} className="size-5" />
          </Pressable>
          <Text className="text-2xl font-rubik-bold">Filters</Text>
          <Pressable onPress={handlerReset}>
            <Text className="text-base text-primary-300 font-rubik-bold">
              Reset
            </Text>
          </Pressable>
        </BottomSheetView>

        {/* Scrollable Content */}
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode={"never"}
          style={{ marginTop: 30 }}
          contentContainerStyle={{
            gap: 32,
            paddingBottom: screenHeight * 0.15 + bottom,
          }}
        >
          {/*price range*/}
          <BottomSheetView className="w-full flex flex-col gap-5">
            <Text className="text-lg font-rubik-medium text-black-300">
              Price Range
            </Text>
            <BottomSheetView className="w-full flex flex-col items-center justify-center">
              <Text className="text-base font-rubik text-black-300">
                ₹{priceRange[0].toLocaleString("en-IN")} - ₹
                {priceRange[1].toLocaleString("en-IN")}
              </Text>
              <MultiSlider
                values={priceRange}
                sliderLength={screenWidth * 0.7}
                onValuesChange={handlePriceChange}
                min={0}
                max={10000}
                step={10}
                allowOverlap={false}
                snapped
                selectedStyle={{ backgroundColor: "#00a2ff" }}
                unselectedStyle={{ backgroundColor: "#d3d3d3" }}
                trackStyle={{
                  // Track style for the slider track
                  height: 4,
                  borderRadius: 2,
                }}
                markerStyle={{
                  // Marker style for the knobs
                  height: 25,
                  width: 25,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "#00a2ff",
                }}
                pressedMarkerStyle={{
                  // Marker style for the knobs
                  height: 29,
                  width: 29,
                  borderRadius: 18,
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "#006bb3",
                }}
              />
            </BottomSheetView>
          </BottomSheetView>

          {/* home details */}
          <BottomSheetView className="w-full flex-col gap-5">
            <Text className="text-lg font-rubik-medium text-black-300">
              Home Details
            </Text>

            {/* bedrooms */}
            <BottomSheetView className="flex flex-row items-center justify-between py-7 border-b border-primary-200">
              <Text className="text-base text-black-200 font-rubik-medium">
                Bedrooms
              </Text>
              <BottomSheetView className="flex flex-row items-center gap-3">
                <Pressable
                  onPress={() => handleBedRoomCounter("plus")}
                  className="size-8 rounded-full bg-primary-200 flex flex-row justify-center items-center active:opacity-50"
                >
                  <Ionicons name="add" size={24} />
                </Pressable>
                <Text className="text-base text-black-300 font-rubik-medium">
                  {bedrooms}
                </Text>
                <Pressable
                  className="size-8 rounded-full bg-primary-200 flex flex-row justify-center items-center active:opacity-50"
                  onPress={() => handleBedRoomCounter("minus")}
                >
                  <Ionicons name="remove" size={24} />
                </Pressable>
              </BottomSheetView>
            </BottomSheetView>

            {/* bathrooms */}
            <BottomSheetView className="flex flex-row items-center justify-between py-7">
              <Text className="text-base text-black-200 font-rubik-medium">
                Bathrooms
              </Text>
              <BottomSheetView className="flex flex-row items-center gap-3">
                <Pressable
                  onPress={() => handlerBathroomCounter("plus")}
                  className="size-8 rounded-full bg-primary-200 flex flex-row justify-center items-center active:opacity-50"
                >
                  <Ionicons name="add" size={24} />
                </Pressable>
                <Text className="text-base text-black-300 font-rubik-medium">
                  {bathrooms}
                </Text>
                <Pressable
                  className="size-8 rounded-full bg-primary-200 flex flex-row justify-center items-center active:opacity-50"
                  onPress={() => handlerBathroomCounter("minus")}
                >
                  <Ionicons name="remove" size={24} />
                </Pressable>
              </BottomSheetView>
            </BottomSheetView>
          </BottomSheetView>

          {/* area size */}
          <BottomSheetView className="w-full flex flex-col gap-5">
            <Text className="text-lg font-rubik-medium text-black-300">
              Area Range
            </Text>
            <BottomSheetView className="w-full flex flex-col items-center justify-center">
              <Text className="text-base font-rubik text-black-300">
                {areaRange[0].toLocaleString("en-IN")} sqft -{" "}
                {areaRange[1].toLocaleString("en-IN")} sqft
              </Text>
              <MultiSlider
                values={areaRange}
                sliderLength={screenWidth * 0.7}
                onValuesChange={handleAreaRange}
                min={0}
                max={10000}
                step={10}
                allowOverlap={false}
                snapped
                selectedStyle={{ backgroundColor: "#00a2ff" }}
                unselectedStyle={{ backgroundColor: "#d3d3d3" }}
                trackStyle={{
                  height: 4,
                  borderRadius: 2,
                }}
                markerStyle={{
                  height: 25,
                  width: 25,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "#00a2ff",
                }}
                pressedMarkerStyle={{
                  height: 29,
                  width: 29,
                  borderRadius: 18,
                  backgroundColor: "#fff",
                  borderWidth: 3,
                  borderColor: "#006bb3",
                }}
              />
            </BottomSheetView>
          </BottomSheetView>

          {/* submit button */}
          <BottomSheetView className="w-full flex flex-row justify-center mt-4">
            <Pressable className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-lg shadow-zinc-400 active:opacity-70">
              <Text className="text-white text-lg text-center font-rubik-bold">
                Apply Filters
              </Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};
