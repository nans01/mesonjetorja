import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Exercise = {
  id: string;
  name: string;
};

export default function ChapterScreen() {
  const navigation = useNavigation();
  const { chapter_id, textbook_id, chapterTitle } = useLocalSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [chapterName, setChapterName] = useState<string>(
    chapterTitle ? String(chapterTitle) : ""
  );

  useEffect(() => {
    // Always fetch exercises
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `https://mesonjetorja.com/api/chapters/${chapter_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
        const data = await response.json();
        setExercises(Array.isArray(data) ? data : data.exercises || []);
        if (!chapterTitle) {
          setChapterName(Array.isArray(data) ? "" : data.name || "");
          navigation.setOptions({
            title: data.name || "",
            headerBackTitle: "Chapters",
          });
        }
      } catch (error) {
        console.error("Failed to load chapters:", error);
      }
    };
    fetchChapters();
  }, [chapter_id]);

  useEffect(() => {
    // Only set the header if chapterTitle is present
    if (chapterTitle) {
      navigation.setOptions({
        title: String(chapterTitle),
        headerLargeTitle: true,
        headerBackTitle: "Chapters",
      });
    }
  }, [navigation, chapterTitle]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link
            href={`/(tabs)/(textbooks)/${textbook_id}/${chapter_id}/${item.id}`}
            asChild
          >
            <TouchableOpacity style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{item.name}</Text>
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
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    width: "100%",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
