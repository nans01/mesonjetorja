import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Types
interface Deck {
  id: string;
  name: string;
  cover: string;
}

// Card component for a single textbook
const DeckCard = ({ deck }: { deck: Deck }) => (
  <Link
    href={{
      pathname: "/(tabs)/(explore)/decks/[deck_id]",
      params: { deck_id: deck.id, title: deck.name },
    }}
  >
    <View style={styles.deckCard}>
      <Image source={{ uri: deck.cover }} style={styles.deckImage} />
      <Text style={styles.deckTitle}>{deck.name}</Text>
    </View>
  </Link>
);

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://mesonjetorja.com/api/decks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setDecks(data);
      } catch (err: any) {
        setError(err.message || "Failed to load textbooks");
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <DeckCard deck={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listContent: {
    gap: 16,
    padding: 16,
  },
  deckCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  deckImage: {
    width: 50,
    height: 70,
    resizeMode: "cover",
    marginRight: 12,
    borderRadius: 4,
  },
  deckTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#c00",
    fontSize: 16,
  },
});
