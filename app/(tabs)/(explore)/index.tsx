import { Link } from "expo-router";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";

const screenWidth = Dimensions.get("window").width;
const itemSize = (screenWidth - 60) / 2; // Adjust depending on how many per row (e.g., 2 or 3)

export default function Explore() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        <Link href="/(tabs)/(explore)/textbooks">
          <View style={styles.card}>
            <Text>Libra</Text>
          </View>
        </Link>
        <Link href="/(tabs)/(explore)/videos">
          <View style={styles.card}>
            <Text>Video</Text>
          </View>
        </Link>
        <Link href="/(tabs)/(explore)/decks">
          <View style={styles.card}>
            <Text>Fletushka</Text>
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // allows items to go to next line
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  card: {
    width: itemSize,
    height: itemSize,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
