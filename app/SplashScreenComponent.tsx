import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, Dimensions, Text, ImageBackground } from "react-native";
import { useRouter } from "expo-router"; // ✅ Use both router and navigation

export default function SplashScreenComponent() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 3000); // ✅ Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSplashComplete) {
      router.replace("/"); // ✅ Navigate only when navigation is ready
    }
  }, [isSplashComplete]);

  return (    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView scrollEnabled={false}>
        <View
          style={{
            width: width,
            height: height,
            backgroundColor: "#f7f3e3",
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 📌 Spiral Binding on the Left */}
          <ImageBackground
            style={{
              width: 70,
              height: height,
              position: "absolute",
              top: 0,
              left: -10,
              zIndex: 10,
            }}
            source={require("@/assets/images/1.png")}
            resizeMode="cover"
          />

          {/* 📌 Top Left (Grapes) */}
          <ImageBackground
            style={{
              width: 770,
              height: 770,
              position: "absolute",
              top: -50,
              left: -126,
              zIndex: 8,
            }}
            source={require("@/assets/images/grape.png")}
            resizeMode="contain"
          />

          {/* 📌 Top Right (Corn, Pepper, Oil) */}
          <ImageBackground
            style={{
              width: 700,
              height: 700,
              position: "absolute",
              top: 0,
              right: -96,
              zIndex: 7,
            }}
            source={require("@/assets/images/corn.png")}
            resizeMode="contain"
          />

          {/* 📌 Main Decorative Frame */}
          <View
            style={{
              width: "85%",
              height: "50%",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "25%",
              zIndex: 5,
            }}
          >
            {/* ✅ Blue Border */}
            <ImageBackground
              style={{
                width: 700,
                height: 700,
                justifyContent: "center",
                alignItems: "center",
                top: 300,
                left: 0,
                zIndex: 10,
              }}
              source={require("@/assets/images/blueborder.png")}
              resizeMode="contain"
            />

            {/* ✅ Blue Ribbon */}
            <ImageBackground
              style={{
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                top: -300,
                zIndex: 7,
              }}
              source={require("@/assets/images/blueribbon.png")}
              resizeMode="contain"
            />

            {/* ✅ Red Ribbon */}
            <ImageBackground
              style={{
                width: 500,
                height: 500,
                top: -450,
              }}
              source={require("@/assets/images/redribbon.png")}
              resizeMode="contain"
            />

            {/* 📌 "NEVER GET HUNGRY" - Title */}
            <Text
              style={{
                position: "absolute",
                top: 55,
                fontSize: 24,
                right: 30,
                fontWeight: "bold",
                color: "#333",
                fontFamily: "JuliusSansOne-Regular",
              }}
            >
              NEVER GET HUNGRY
            </Text>

            {/* 📌 "What are you having for dinner?" - Subtitle */}
            <Text
              style={{
                position: "absolute",
                top: 260,
                left: 45,
                fontSize: 18,
                fontWeight: "400",
                color: "#555",
                fontFamily: "Gloock-Regular",
              }}
            >
              What are you having for dinner?
            </Text>
          </View>

          {/* 📌 Bottom Left (Onion, Olive) */}
          <ImageBackground
            style={{
              width: 770,
              height: 770,
              position: "absolute",
              bottom: -60,
              right: -138,
              zIndex: 6,
            }}
            source={require("@/assets/images/onion.png")}
            resizeMode="contain"
          />

          {/* 📌 Bottom Right (Beef, Tomato, Cheese) */}
          <ImageBackground
            style={{
              width: 700,
              height: 700,
              position: "absolute",
              bottom: -20,
              left: -95,
              zIndex: 5,
            }}
            source={require("@/assets/images/beef.png")}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}