import { Dimensions } from "react-native";

export const useScreenDimensions = () => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return {
    screenWidth,
    screenHeight,
  };
};
