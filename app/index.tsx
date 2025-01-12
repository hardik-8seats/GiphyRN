import { Text, View } from "react-native";

export default function Index() {
  const apiKey = process.env.EXPO_PUBLIC_GIPHY_API_KEY;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>API KEY: {apiKey}</Text>
    </View>
  );
}
