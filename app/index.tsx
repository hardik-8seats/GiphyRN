import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export type Gif = {
  id: string;
  title: string;
  images: {
    downsized: {
      url: string;
    };
  }
};

export default function Index() {
  const apiKey = process.env.EXPO_PUBLIC_GIPHY_API_KEY;
  const [gifs, setGifs] = useState<Gif[]>([]);

  useEffect(() => {
    const fetchGifs = async () => {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=15&rating=g`
      );
      const data = await response.json();
      setGifs(data.data);
      console.log(data);
    }
    fetchGifs();
  }, [apiKey]);

  const renderItem = ({ item }: { item: Gif }) => (
    <TouchableOpacity onPress={() => router.push(`/${item.id}`)} style={{ padding: 15, margin: 15, backgroundColor: 'white' }}>
      <Image source={{ uri: item.images?.downsized?.url }} style={{ width: '100%', height: 200 }} />
      <Text style={{marginVertical: 15}}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        // flex: 1,
      }}
    >
      <FlatList
        data={gifs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
       />
    </View>
  );
}
