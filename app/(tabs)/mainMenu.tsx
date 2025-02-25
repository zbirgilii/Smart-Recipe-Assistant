import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router"; 

export default function MainMenuScreen() {
  const router = useRouter(); 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        <ImageBackground
          source={require("@/assets/images/background.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.menuContainer}>
            <ImageBackground
              source={require("@/assets/images/shape1.png")}
              style={styles.parchment}
              resizeMode="contain"
            >
              <ImageBackground
                source={require("@/assets/images/redborder.png")}
                style={styles.border}
                resizeMode="contain"
              />
              {/* Food images */}
              <ImageBackground
                source={require("@/assets/images/FoodGrouped.png")}
                style={styles.food}
                resizeMode="contain"
              />
              <ImageBackground
                source={require("@/assets/images/redribbon2.png")}
                style={styles.ribbon}
                resizeMode="contain"
              >
                <Text style={styles.titleText}>MENU</Text>
              </ImageBackground>

              <View style={styles.menuContent}>
                <Pressable
                  style={styles.beginButton}
                  onPress={() => router.push("/(tabs)/explore")} 
                >
                  <Text style={styles.beginText}>BEGIN</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "130%",
    top:-80,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: "95%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  parchment: {
    width: "100%",
    height: "110%",
    top: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    position: "absolute",
    width: "100%",
    height: "110%",
    alignItems: "center",
    justifyContent: "center"
  },
  ribbon: {
    position: "absolute",
    width: 300,
    height: 300,
    top: -120,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    top: -7,
  },
  menuContent: {
    position: "absolute",
    top: "25%",
    alignItems: "center",
  },
  beginButton: {
    backgroundColor: "#5A5858",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 50,
    top: 100,
  },
  beginText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  food: {
    height:"113%",
    width: "150%", // You may adjust these if needed
    aspectRatio: 1, // Keeps the image square while scaling
    left: -190,
    alignItems: "center",
    justifyContent: "center",
  },
});
