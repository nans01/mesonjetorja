import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

type ExerciseDetails = {
  id: string;
  name: string;
  question_webview_url: string;
};

export default function ExerciseScreen() {
  const navigation = useNavigation();
  const { exercise_id } = useLocalSearchParams();
  const [exercise, setExercise] = useState<ExerciseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const [solutionWebviewUrl, setSolutionWebviewUrl] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const fetchExercise = async () => {
      if (!exercise_id) return;
      try {
        const response = await fetch(
          `https://mesonjetorja.com/api/exercises/${exercise_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );
        const data = await response.json();
        setExercise(data);
        // If solutions is an array, get the first solution's id and webview_url
        if (
          data.solutions &&
          Array.isArray(data.solutions) &&
          data.solutions.length > 0
        ) {
          setSolutionId(data.solutions[0].id);
          setSolutionWebviewUrl(data.solutions[0].webview_url);
        }
      } catch (error) {
        console.error("Failed to load exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exercise_id]);

  useEffect(() => {
    if (exercise) {
      navigation.setOptions({
        title: `Exercise ${exercise.name}`,
        headerBackTitle: "Exercises",
      });
    }
  }, [navigation, exercise]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!exercise || !exercise.question_webview_url) {
    return (
      <View style={styles.centered}>
        <Text>Could not load exercise.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {solutionWebviewUrl && (
        <>
          <WebView
            source={{ uri: solutionWebviewUrl }}
            style={{ flex: 1, minHeight: 200 }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
