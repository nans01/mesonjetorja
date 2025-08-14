import { Stack, useLocalSearchParams } from "expo-router";

export default function ExerciseLayout() {
  const { exercise_name } = useLocalSearchParams();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: exercise_name
            ? `Exercise ${String(exercise_name)}`
            : "Exercise",
        }}
      />
    </Stack>
  );
}
