import { DarkColor } from "@/types";
import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";

export default function RootLayout() {
  if (Platform.OS === 'android') StatusBar.setBackgroundColor(DarkColor);

  return <Stack screenOptions={headerStyle}>
    <Stack.Screen name="index" options={{
      title: 'GIPHY',
    }} />
    <Stack.Screen name="[gifId]" options={{title: 'Feedback'}}/>
  </Stack>;
}

const headerStyle = {
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: DarkColor,
  },
}
