import { Doc } from "@/convex/_generated/dataModel";
import { View, Text } from "react-native";

type Props = {
  item: Doc<"reviews">;
};
const Comment = ({ item }: Props) => {
  return (
    <View>
      <Text>Comment</Text>
    </View>
  );
};

export default Comment;
