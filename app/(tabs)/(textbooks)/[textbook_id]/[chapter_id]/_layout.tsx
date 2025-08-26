import { Stack, useLocalSearchParams } from "expo-router";

export default function ExerciseLayout() {
  const { chapterTitle, exerciseTitle } = useLocalSearchParams();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: chapterTitle ? String(chapterTitle) : "Chapter",
          headerShown: false,
          headerLargeTitle: true,
          headerBackTitle: "Chapters",
        }}
      />
      <Stack.Screen
        name="[exercise_id]"
        options={{
          title: exerciseTitle
            ? `Exercise ${String(exerciseTitle)}`
            : "Exercise",
          headerShown: false,
          headerBackTitle: "Exercises",
        }}
      />
    </Stack>
  );
}
