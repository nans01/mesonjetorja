import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Types
interface Subject {
  _id: string;
  name: string;
}

interface Grade {
  _id: string;
  name: string;
}

interface Publisher {
  _id: string;
  name: string;
}

interface Textbook {
  id: string;
  slug: string;
  title: string;
  author: string;
  cover: string;
  cover_blur_hash: string;
  external_url: string | null;
  subject: Subject | null;
  grade: Grade | null;
  publisher: Publisher;
  createdAt: string;
  updatedAt: string;
}

import { useSegments } from "expo-router";

const TextbookCard = ({ textbook }: { textbook: Textbook }) => {
  const router = useRouter();
  const segments = useSegments();

  const handlePress = () => {
    const isHomeTab = segments[1] === "(home)";
    if (isHomeTab) {
      // Switch to textbooks tab, then push detail screen
      router.replace("/(tabs)/(textbooks)");
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/(textbooks)/[textbook_id]",
          params: {
            textbook_id: textbook.id,
            title: textbook.title,
            key: Date.now().toString(),
          },
        });
      }, 100); // Small delay to allow tab switch
    } else {
      router.push({
        pathname: "/(tabs)/(textbooks)/[textbook_id]",
        params: {
          textbook_id: textbook.id,
          title: textbook.title,
          key: Date.now().toString(),
        },
      });
    }
  };
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.bookCard}>
        <Image source={{ uri: textbook.cover }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{textbook.title}</Text>
          <Text
            style={styles.bookAuthor}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {textbook.author}
          </Text>
          <Text style={styles.bookSubject}>
            {textbook.publisher?.name || "Unknown Publisher"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function Textbooks() {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTextbooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://mesonjetorja.com/api/textbooks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTextbooks(data);
      } catch (err: any) {
        setError(err.message || "Failed to load textbooks");
      } finally {
        setLoading(false);
      }
    };
    fetchTextbooks();
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
          data={textbooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <TextbookCard textbook={item} />}
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
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  bookImage: {
    width: 50,
    height: 70,
    resizeMode: "cover",
    marginRight: 12,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  bookSubject: {
    fontSize: 12,
    color: "#999",
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
