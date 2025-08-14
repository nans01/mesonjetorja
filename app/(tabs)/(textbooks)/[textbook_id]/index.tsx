import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Chapter = {
  id: string;
  name: string;
};

export default function ChapterScreen() {
  const navigation = useNavigation();
  const { textbook_id } = useLocalSearchParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [textbookTitle, setTextbookTitle] = useState<string>("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `https://mesonjetorja.com/api/textbooks/${textbook_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
        const data = await response.json();
        setChapters(Array.isArray(data) ? data : data.chapters || []);
        setTextbookTitle(Array.isArray(data) ? "" : data.title || "");
      } catch (error) {
        console.error("Failed to load chapters:", error);
      }
    };
    fetchChapters();
  }, [textbook_id]);

  return (
    <SafeAreaView>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/(textbooks)/${textbook_id}/${item.id}`} asChild>
            <TouchableOpacity style={styles.chapteritem}>
              <Text style={styles.chapterName}>{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  chapteritem: {
    alignItems: "flex-start", // Changed from "center"
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  chapterName: {
    fontSize: 16, // Slightly larger
    fontWeight: "500",
  },
});
