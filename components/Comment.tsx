import icons from "@/constants/icons";
import { Doc } from "@/convex/_generated/dataModel";
import { View, Text, Image } from "react-native";

type Props = {
  review: Doc<"reviews">;
};
const Comment = ({ review }: Props) => {
  return (
    <View className="flex flex-col items-start">
      <View className="flex flex-row items-center justify-start gap-3">
        <Image
          source={{ uri: review?.imageUrl }}
          className="size-14 rounded-full"
        />
        <Text className="text-black-300 text-base text-start font-rubik-bold">
          {review?.name}
        </Text>
      </View>
      <Text className="text-black-200 text-base font-rubik mt-2">
        {review?.review}
      </Text>
      <View className="flex flex-row items-center w-full justify-between mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#0061FF"}
          />
          <Text className="text-black-300 text-sm font-rubik-medium ml-2">
            120
          </Text>
        </View>
        <Text className="text-black-100 text-sm font-rubik">
          {new Date(review?._creationTime).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
