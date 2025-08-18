import { Stack, useLocalSearchParams } from "expo-router";

export default function TextbookLayout() {
  const { chapterTitle } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[chapter_id]"
        options={({ route }) => {
          const params = route.params as { chapterTitle?: string } | undefined;
          return {
            title: params?.chapterTitle ?? "Chapter",
            headerLargeTitle: true,
            headerBackTitle: "Chapters",
          };
        }}
      />
    </Stack>
  );
}
