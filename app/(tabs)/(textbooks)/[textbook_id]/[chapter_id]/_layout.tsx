import { Stack, useLocalSearchParams } from "expo-router";

export default function ExerciseLayout() {
  const { chapterTitle, exerciseTitle } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: chapterTitle ? String(chapterTitle) : "Chapter",
          headerShown: true,
          headerLargeTitle: true,
          headerBackTitle: "Chapters",
        }}
      />
      <Stack.Screen
        name="[exercise_id]/index"
        options={{
          title: exerciseTitle
            ? `Exercise ${String(exerciseTitle)}`
            : "Exercise",
          headerShown: true,
          headerBackTitle: "Exercises",
        }}
      />
    </Stack>
  );
}
