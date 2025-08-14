import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Explore",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="textbooks"
        options={{
          title: "Textbooks",
          headerLargeTitle: false,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="videos"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="decks"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
