import React from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";

export default function ExploreScreen() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <ScrollView>
          <Text style={styles.contentText}>Welcome to the Explore Page!</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerImage: { height: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#007AFF" },
  headerText: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  contentText: { fontSize: 18, textAlign: "center", marginTop: 20 },
});
