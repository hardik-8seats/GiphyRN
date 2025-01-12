import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { Gif } from ".";

export default function Details() {
  const { gifId } = useLocalSearchParams();
  const navigation = useNavigation();
  const apiKey = process.env.EXPO_PUBLIC_GIPHY_API_KEY;

  const [gif, setGif] = useState<Gif>();

  useEffect(() => {
    const fetchGifs = async () => {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`
      );
      const data = await response.json();
      setGif(data.data);
      console.log(data);
    }
    fetchGifs();
  }, [apiKey, gifId]);

  useEffect(() => {
    navigation.setOptions({ title: `${gif?.title}` });
  }, [navigation, gif]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {gif && <Image source={{ uri: gif?.images?.downsized?.url }} style={{ width: '100%', height: 200 }} />}
    </View>
  );
}
