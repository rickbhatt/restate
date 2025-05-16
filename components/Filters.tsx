import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { categories } from "@/constants/data";

const Filters = () => {
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

export default Filters;
