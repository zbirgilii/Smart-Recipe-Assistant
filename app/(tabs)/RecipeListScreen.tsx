import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';

const recipes = [
  {
    title: 'Simple Egg Salad',
    description: 'Mix boiled eggs, mayo, and chopped veggies for a quick and tasty egg salad.',
  },
  // Add more recipes to test scrolling
  //{
   // title: 'Avocado Toast',
   // description: 'Toast bread, mash avocado, and add salt/pepper to taste.'
  //},
  //{
  //  title: 'Vegetable Stir Fry',
 //   description: 'Stir fry your favorite vegetables with soy sauce and garlic.'
 // }
];

export default function RecipeListScreen() {
  const router = useRouter();

  const handleSaveToFavorites = () => {
    console.log('Recipe saved to favorites!');
  };

  const handleGoBackToMainMenu = () => {
    router.push('/mainMenu');
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
      {/* Add parchment only around the content area */}
        <ImageBackground
          source={require('@/assets/images/shape1.png')}
          style={styles.parchment}
          resizeMode="stretch"
        >
  {/* Add border as overlay */}
  <ImageBackground
    source={require('@/assets/images/redborder.png')}
    style={styles.borderOverlay}
    resizeMode="stretch"
  >
        {/* Recipe List - now should be clearly visible */}
        <ScrollView 
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
        >
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeTextContainer}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>
                {recipe.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSaveToFavorites}>
            <Text style={styles.buttonText}>Save to Favorites</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleGoBackToMainMenu}>
            <Text style={styles.buttonText}>Main Menu</Text>
          </Pressable>
        </View>
        </ImageBackground>
        </ImageBackground>
      </View>
    </ImageBackground>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Temporary dark background
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  recipeList: {
    flexGrow: 1, // Important for ScrollView
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -120,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5A5858',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }, 
  background: {
    flex: 1,
  },
  parchment: {
    flex: 1,
    padding: 10,
    margin: 10,
     // Gives space for the border we'll add next
  },
  borderOverlay: {
    flex: 1,
    width:"115%",
    right:40,

    padding: 10, // Ensures content doesn't touch the border
  },
  ribbonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  ribbon: {
    width: 250,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRibbon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  recipeTextContainer: {
    marginBottom: 20, 
    top:50,
    left:30,
    flex: 1,
    padding: 10,
    margin: 10,
  }
});