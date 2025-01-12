import { DarkColor } from "@/types";
import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";

export default function RootLayout() {
  if (Platform.OS === 'android') StatusBar.setBackgroundColor(DarkColor);

  return <Stack >
    <Stack.Screen name="index" options={{
      title: 'GIPHY',
      ...headerStyle
    }} />
    <Stack.Screen name="[gifId]" options={headerStyle} />
  </Stack>;
}

const headerStyle = {
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: DarkColor,
  },
}
