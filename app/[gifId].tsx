import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkColor } from "@/types";
import { Image } from 'expo-image';

export default function Details() {
  const { gifId, url, title } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: title });
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem(`${gifId}`);
        if (value !== null) {
          const { rating, comment } = JSON.parse(value);
          setRating(rating);
          setComment(comment);
        }
      } catch (e) {
        console.error("Error reading data:", e);
      }
    };
    getData();
  }, [navigation, title, gifId]);

  const submit = async () => {
    Keyboard.dismiss();
    if (rating === 0) {
      Alert.alert("Please provide star ratings!");
      return;
    }
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    try {
      await AsyncStorage.setItem(
        `${gifId}`,
        JSON.stringify({ rating, comment })
      );
      Alert.alert("Thanks for your feedback!");
    } catch (e) {
      console.error("Error saving data:", e);
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.keyboardView}>
      <Image source={{ uri: `${url}` }} style={styles.image} accessibilityLabel={`Image name ${title}`}/>
      <View style={styles.container}>
      <StarRating rating={rating} onChange={setRating} starSize={60} accessibilityLabel="Star ratings out of 5" style={styles.star} color={DarkColor}/>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Write your comment..."
        style={styles.input}
        multiline
      />
      <Button
        title="Submit"
        onPress={submit}
        color={DarkColor}
        accessibilityLabel="Submit your rating and comment"
      />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: { 
    padding: 20,
  },
  image: {
    width: "100%",
    height: 350,
  },
  star: {
    alignSelf: "center",
  },
  input: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#f4511e",
    borderRadius: 5,
    padding: 10,
    marginVertical: 20,
    textAlignVertical: "top",
  },
});
