import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Text,
  Pressable
} from "react-native";
import { useRouter } from "expo-router"; 

const { width, height } = Dimensions.get("window");

export default function MainMenuScreen() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: { width: width * 0.95, height: height * 0.90, alignItems: "center", justifyContent: "center", top: -50 },
  parchment: { width: "100%", height: "90%", top: 90, alignItems: "center", justifyContent: "center" },
  border: { position: "absolute", width: "100%", height: "100%", top: -60 },
  ribbon: { position: "absolute", width: 300, height: 300, top: -160, alignItems: "center", justifyContent: "center" },
  titleText: { fontSize: 32, fontWeight: "bold", color: "#FFF", top: -7 },
  menuContent: { position: "absolute", top: "25%", alignItems: "center" },
  beginButton: { backgroundColor: "#5A5858", paddingVertical: 20, paddingHorizontal: 50, borderRadius: 50, top: 60 },
  beginText: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
  food: {width: 800, height: 800, top:-10, alignItems: "center", justifyContent: "center",
  },
});
