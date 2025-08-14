import { Stack, useLocalSearchParams } from "expo-router";

export default function TextbookLayout() {
  const { chapterTitle } = useLocalSearchParams();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Textbook",
          headerLargeTitle: true,
          headerBackTitle: "Textbooks",
        }}
      />
      <Stack.Screen
        name="[chapter_id]"
        options={{
          title: "Chapter",
          headerBackTitle: "Chapters",
        }}
      />
    </Stack>
  );
}
