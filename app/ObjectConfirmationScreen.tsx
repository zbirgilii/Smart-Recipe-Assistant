// ObjectConfirmationScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ObjectConfirmationScreen() {
  const router = useRouter();

  // For demo, we just hardcode 4 recognized ingredients.
  // Replace this with your real recognized objects data.
  const recognizedIngredients = ['Lettuce', 'Eggs', 'Mayo', 'Tomato'];

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')} // your chalkboard image
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Object Confirmation</Text>
        <ScrollView style={styles.listContainer}>
          {recognizedIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.ingredientImage} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </ScrollView>
        <Pressable
          style={styles.confirmButton}
          onPress={() => router.push('/RecipeListScreen')}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ingredientImage: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 10,
    marginRight: 15,
  },
  ingredientText: {
    fontSize: 20,
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#5A5858',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
