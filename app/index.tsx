import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DarkColor, Gif } from "@/types";
import useGifs from "@/src/hooks/useGifs";
import { useCallback } from "react";
import { Image } from 'expo-image';

export default function Index() {
  const { pullToRefresh, search, loadMore, loading, query, gifs } = useGifs();

  // When the user taps on a GIF, navigate to the GIF details screen
  const onPress = useCallback((item: Gif) => {
    router.push({
      pathname: `/[gifId]`,
      params: {
        gifId: item.id,
        url: item.images?.downsized?.url,
        title: item.title
      }
    });
  }, []);

  // Render each GIF in a card
  const renderItem = useCallback(({ item }: { item: Gif }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
      <Image source={{ uri: item.images?.downsized?.url }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  ), [onPress]);

  return (
    <View
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        placeholder="Search GIFs"
        returnKeyType="search"
        defaultValue={query}
        // onChangeText={search}
        onSubmitEditing={search}
        clearButtonMode="always"
      />
      <FlatList
        data={gifs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListFooterComponent={<View style={{ height: 60, justifyContent: 'center' }} >
          {loading && <ActivityIndicator size="large" color={DarkColor} />}
        </View>}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        onRefresh={pullToRefresh}
        refreshing={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5e4df',
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#f5e4df',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    padding: 15,
    fontSize: 16,
    fontWeight: 'semibold',
  }
});
