import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 

export default function objectsConfirm() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Ingredients</Text>
      {/* Add logic to confirm ingredients */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
